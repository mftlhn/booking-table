<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Table;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function cart()
    {
        $menus = Menu::with('images')
                ->where('is_active', 1)
                ->get();
        // Ambil ID meja yang sedang digunakan dalam transaksi aktif
        $unavailableTableIds = Transaction::whereIn('status', ['confirmed', 'paid', 'processing'])
            ->pluck('table_id')
            ->toArray();

        // Ambil semua meja dan tambahkan flag `is_available`
        $tables = Table::all()->map(function ($table) use ($unavailableTableIds) {
            $table->is_available = !in_array($table->id, $unavailableTableIds);
            return $table;
        });

        // Cek apakah user sudah memiliki transaksi aktif (dalam waktu booking sama)
        $existingTransaction = Transaction::with('details.menu')
            ->where('user_id', Auth::user()->id)
            ->where('status', 'confirmed') // hanya yang sudah dikonfirmasi
            ->whereRaw('DAY(booking_start) = DAY(NOW())')
            ->first();
        // dd($existingTransaction);

        return Inertia::render('Customer/Menu/Index', compact('menus', 'tables', 'existingTransaction'));
    }

    public function storeTransaction(Request $request)
    {
        // Cek apakah user sudah memiliki transaksi aktif (dalam waktu booking sama)
        $existingTransaction = Transaction::where('user_id', Auth::user()->id)
            ->where('status', 'confirmed') // hanya yang sudah dikonfirmasi
            ->whereDate('booking_start', Carbon::parse($request->booking_start))
            ->exists();
            // dd($existingTransaction);
        if ($existingTransaction) {
            return back()->with('error', 'Anda sudah memiliki transaksi aktif ' . Carbon::parse($request->booking_start)->format('d-m-Y') . '. Silakan selesaikan transaksi tersebut.');
        }
        
        // DB::beginTransaction();
        DB::transaction(function () use ($request) {
            // Validasi input
            $subtotal = collect($request->items)->sum(function ($item) {
                return $item['price'] * $item['quantity'];
            });
            
            $tax = $subtotal * 0.1; // 10% pajak
            $total = $subtotal + $tax;
            
            $transaction = Transaction::create([
                'user_id' => Auth::user()->id,
                'table_id' => $request->table_id,
                'booking_start' => Carbon::parse($request->booking_start),
                'booking_end' => Carbon::parse($request->booking_start)->addHours(2), // booking selama 2 jam
                'invoice_number' => $this->invoiceGenerator(),
                'total_price' => $total,
                'subtotal_price' => $subtotal,
                'tax' => $tax,
                'status' => 'confirmed',
            ]);
            // dd($transaction);
    
            foreach ($request->items as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

        });

        return redirect()->back()->with('success', 'Pesanan berhasil dikonfirmasi!');
    }

    public function updateConfirmedTransaction(Request $request)
    {
        // dd($request->all());
        DB::transaction(function () use ($request) {
            $transaction = Transaction::findOrFail($request->booking_id);
            $subtotal = collect($request->items)->sum(function ($item) {
                return $item['price'] * $item['quantity'];
            });
            $subtotal_accumulation = $subtotal + $transaction->subtotal_price; 
            $tax = $subtotal_accumulation * 0.1; // 10% pajak
            $total = $subtotal_accumulation + $tax;

            $transaction->update([
                'subtotal_price' => $subtotal_accumulation,
                'tax' => $tax,
                'total_price' => $total,
            ]);

            foreach ($request->items as $value) {
                // Cek apakah detail transaksi sudah ada
                $existingDetail = TransactionDetail::where('transaction_id', $request->booking_id)
                    ->where('menu_id', $value['menu_id'])
                    ->first();

                if ($existingDetail) {
                    $updatedQuantity = $existingDetail->quantity + $value['quantity'];
                    $updatedSubtotal = $value['price'] * $updatedQuantity;
                    $existingDetail->update([
                        'quantity' => $updatedQuantity,
                        'subtotal' => $updatedSubtotal,
                    ]);
                    continue;
                }
                TransactionDetail::create([
                    'transaction_id' => $request->booking_id,
                    'menu_id' => $value['menu_id'],
                    'quantity' => $value['quantity'],
                    'price' => $value['price'],
                    'subtotal' => $value['price'] * $value['quantity'],
                ]);
            }
        });

        return redirect()->back()->with('success', 'Pesanan berhasil ditambahkan!');
    }

    public function getTransactionHistory($userId)
    {
        $transaction = Transaction::with('details.menu', 'user', 'table')
                        ->where('user_id', $userId)
                        ->orderBy('booking_start', 'desc')
                        ->get();

        return response()->json($transaction);
    }
    
    public function checkAvailableTables(Request $request)
    {
        $start = Carbon::parse($request->booking_start);
        $end = $start->copy()->addHours(2);

        $conflictingTableIds = Transaction::whereIn('status', ['confirmed'])
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('booking_start', [$start, $end])
                    ->orWhereBetween('booking_end', [$start, $end])
                    ->orWhere(function ($q) use ($start, $end) {
                        $q->where('booking_start', '<=', $start)
                        ->where('booking_end', '>=', $end);
                    });
            })
            ->pluck('table_id')
            ->toArray();

        $tables = Table::all()->map(function ($table) use ($conflictingTableIds) {
            $table->is_available = !in_array($table->id, $conflictingTableIds);
            return $table;
        });

        return response()->json($tables);
    }

    public function invoiceGenerator()
    {
        $now = now();
        $year = $now->format('y');   // 2 digit tahun
        $month = $now->format('m');  // 2 digit bulan

        // Ambil transaksi terakhir di bulan dan tahun ini
        $lastTransaction = Transaction::whereYear('created_at', $now->format('Y'))
                            ->whereMonth('created_at', $month)
                            ->latest()
                            ->first();

        if ($lastTransaction && preg_match('/INV\/\d{2}\/\d{2}\/(\d{4})/', $lastTransaction->invoice_number, $matches)) {
            $lastSequence = (int) $matches[1];
            $newSequence = $lastSequence + 1;
        } else {
            $newSequence = 1;
        }

        $sequence = str_pad($newSequence, 4, '0', STR_PAD_LEFT);

        $invoiceNumber = "INV/{$year}/{$month}/{$sequence}";

        return $invoiceNumber;
    }
}
