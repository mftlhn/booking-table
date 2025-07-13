<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Report Transaksi</title>
    <style>
        body {
            font-family: arial, sans-serif;
            font-size: 10px
        }

        .top-code {
            display: flex;
            justify-content: space-between;
            align-items: center
        }

        .child-top {
            flex: 1
        }

        .mt-10 {
            margin-top: 10px
        }

        .border-table {
            border: 1px solid black;
            padding: 5px;
            text-align: center
        }

        .border-table-right {
            border: 1px solid black;
            padding: 5px;
            text-align: right
        }

        .border-table-aja {
            border: 1px solid black;
            padding: 5px;
        }
    </style>
</head>

<body>
    <table width="100%">
        <tr>
            <th class="border-table" style="">LAPORAN TRANSAKSI {{ env('APP_NAME') }} PERIODE {{ $bulan }} -
                {{ $tahun }}</th>
        </tr>
    </table>
    <table width="60%" class="mt-10" style="border-collapse: collapse">
        <tr>
            <th class="border-table-aja">Jumlah Transaksi Berhasil</th>
            <th class="border-table-aja">Total Pendapatan</th>
            <th class="border-table-aja">Jumlah Transaksi Batal</th>
            <th class="border-table-aja">Jumlah Transaksi Belum Selesai</th>
        </tr>
        <tr>
            <td class="border-table">{{ count($paid_transactions) }}</td>
            <td class="border-table">Rp {{ number_format($total_paid) }}</td>
            <td class="border-table">{{ count($canceled_transactions) }}</td>
            <td class="border-table">{{ count($confirmed_transactions) }}</td>
        </tr>
    </table>
    <table style="margin-top: 20px; border-collapse: collapse" width="100%">
        <tr>
            <th class="border-table">#</th>
            <th class="border-table">No. Invoice</th>
            <th class="border-table">Customer</th>
            <th class="border-table">Table</th>
            <th class="border-table">Tanggal Booking</th>
            <th class="border-table">Status</th>
            <th class="border-table">Sub Total</th>
            <th class="border-table">Tax</th>
            <th class="border-table">Total</th>
        </tr>
        @foreach ($transactions as $key => $transaction)
            <tr>
                <td class="border-table">{{ $key + 1 }}</td>
                <td class="border-table">{{ $transaction->invoice_number }}</td>
                <td class="border-table">{{ $transaction->user->name }}</td>
                <td class="border-table">{{ $transaction->table->name }}</td>
                <td class="border-table">{{ Carbon\Carbon::parse($transaction->booking_start)->format('d-m-Y H:i') }}
                </td>
                <td class="border-table">{{ strtoupper($transaction->status) }}</td>
                <td class="border-table-right">Rp {{ number_format($transaction->subtotal_price, 0, ',', '.') }}</td>
                <td class="border-table-right">Rp {{ number_format($transaction->tax, 0, ',', '.') }}</td>
                <td class="border-table-right">Rp {{ number_format($transaction->total_price, 0, ',', '.') }}</td>
            </tr>
        @endforeach
    </table>
    <table style="margin-top: 30px; border-collapse: collapse">
        <tr>
            <td class="border-table">Printed By</td>
        </tr>
        <tr>
            <td class="border-table">{{ auth()->user()->name }}</td>
        </tr>
    </table>
</body>

</html>
