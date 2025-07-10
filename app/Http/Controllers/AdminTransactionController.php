<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminTransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'table', 'details.menu'])
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
                'status' => 'canceled',
                'canceled_reason' => $request->canceled_reason
            ]);
        });

        return back()->with('success', 'Transaksi berhasil dibatalkan!');
    }
}
