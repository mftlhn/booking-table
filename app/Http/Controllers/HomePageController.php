<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Table;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomePageController extends Controller
{
    public function index()
    {
        $menus = Menu::with('images')
                ->where('is_active', 1)
                ->limit(3)
                ->inRandomOrder()
                ->get();

        return Inertia::render('Welcome', compact('menus'));
    }

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

        return Inertia::render('Customer/Menu/Index', compact('menus', 'tables'));
    }

    public function storeTransaction(Request $request)
    {
        $request->validate([
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        // Cek apakah meja sudah dipakai
        $isTableUsed = Transaction::where('table_id', $request->table_id)
            ->whereIn('status', ['confirmed', 'paid', 'processing'])
            ->exists();

        if ($isTableUsed) {
            return back()->withErrors(['table_id' => 'Meja sudah digunakan. Silakan pilih meja lain.']);
        }

        DB::beginTransaction();

        try {
            $subtotal = collect($request->items)->sum(function ($item) {
                return $item['price'] * $item['quantity'];
            });

            $tax = $subtotal * 0.1; // 10% pajak
            $total = $subtotal + $tax;

            $transaction = Transaction::create([
                'user_id' => Auth::user()->id, // null jika guest
                'table_id' => $request->table_id,
                'invoice_number' => 'INV-' . time(),
                'total_price' => $total,
                'tax' => $tax,
                'status' => 'confirmed',
            ]);

            foreach ($request->items as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

            DB::commit();

            return redirect()->route('customer.success')->with('success', 'Pesanan berhasil dikonfirmasi!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan pesanan.']);
        }
    }
}
