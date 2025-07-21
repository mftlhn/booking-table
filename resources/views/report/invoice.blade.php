<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Struk Transaksi</title>
    <style>
        body {
            font-family: monospace, sans-serif;
            font-size: 10px;
            line-height: 1.2;
            margin: 0;
            padding: 0;
        }

        .wrapper {
            width: 100%;
            padding: 5px;
        }

        .center {
            text-align: center;
        }

        .mt-10 {
            margin-top: 10px;
        }

        table {
            width: 100%;
        }

        .border-top {
            border-top: 1px dashed #000;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        .right {
            text-align: right;
        }

        .bold {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="center">
            <h3>{{ env('APP_NAME') }}</h3>
            <p>{{ now()->format('d/m/Y H:i') }}</p>
        </div>

        <div class="border-top"></div>

        <p>Invoice : <strong>{{ $transaction->invoice_number }}</strong></p>
        <p>Customer: {{ $transaction->user->name }}</p>
        <p>Table : {{ $transaction->table->name }}</p>
        <p>Tanggal : {{ \Carbon\Carbon::parse($transaction->booking_start)->format('d/m/Y H:i') }}</p>
        <p>Kasir : {{ $transaction->cashier->name ?? '-' }}</p>

        <div class="border-top"></div>

        <table>
            @foreach ($transaction->details as $detail)
                <tr>
                    <td colspan="2">{{ $detail->menu->name }}</td>
                </tr>
                <tr>
                    <td>{{ $detail->quantity }} x Rp {{ number_format($detail->price, 0, ',', '.') }}</td>
                    <td class="right">Rp {{ number_format($detail->subtotal, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </table>

        <div class="border-top"></div>

        <table>
            <tr>
                <td class="bold">Subtotal</td>
                <td class="right">Rp {{ number_format($transaction->subtotal_price, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="bold">Pajak (10%)</td>
                <td class="right">Rp {{ number_format($transaction->tax, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="bold">Total</td>
                <td class="right">Rp {{ number_format($transaction->total_price, 0, ',', '.') }}</td>
            </tr>

            @if ($transaction->status === 'paid')
                <tr>
                    <td class="bold">Bayar</td>
                    <td class="right">Rp {{ number_format($transaction->customer_payment, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td class="bold">Kembalian</td>
                    <td class="right">Rp {{ number_format($transaction->change, 0, ',', '.') }}</td>
                </tr>
            @endif
        </table>

        <div class="border-top"></div>

        <div class="center">
            <p>Terima kasih!</p>
            <p>-- {{ env('APP_NAME') }} --</p>
        </div>
    </div>
    <script>
        window.onload = () => {
            window.print();
        };
    </script>
</body>

</html>
