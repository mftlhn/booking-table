<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminTransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'table', 'details.menu', 'cashier'])
            // ->whereDate('booking_start', Carbon::now())
            ->orderBy('created_at', 'desc')
            ->get();
            // dd($transactions);

        return Inertia::render('Transaction/Index', compact('transactions'));
    }

    public function pay(Request $request)
    {
        // dd($request->all());
        DB::transaction(function () use ($request) {
            $transaction = Transaction::find($request->id);

            $transaction->update([
                'charge' => $request->charge,
                'customer_payment' => $request->customer_payment,
                'change' => $request->change,
                'status' => 'paid',
                'cashier_id' => Auth::user()->id,
            ]);
        });

        return back()->with('success', 'Transaksi berhasil dibayar!');
    }

    public function cancel(Request $request)
    {
        // dd($request->all());
        DB::transaction(function () use ($request) {
            $transaction = Transaction::find($request->id);

            $transaction->update([
                'status' => 'cancelled',
                'canceled_reason' => $request->canceled_reason,
                'chashier_id' => Auth::user()->id,
            ]);
        });

        return back()->with('success', 'Transaksi berhasil dibatalkan!');
    }

    public function print($id)
    {
        $transaction = Transaction::with(['user', 'table', 'details.menu', 'cashier'])
                        ->find($id);


        $pdf = Pdf::loadView('report.invoice', compact('transaction'))->setPaper([0, 0, 226.77, 900], 'portrait');
        return $pdf->stream('transaction_' . env('APP_NAME') . '.pdf');
    }
}
