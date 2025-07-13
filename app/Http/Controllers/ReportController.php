<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'table', 'details.menu'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Report/Index', compact('transactions'));
    }

    public function searchTransaction($month, $year)
    {
        $transactions = Transaction::with(['user', 'table', 'details.menu'])
            ->whereMonth('booking_start', $month)
            ->whereYear('booking_start', $year)
            ->orderBy('booking_start', 'desc')
            ->get();

        return response()->json($transactions);
    }

    public function month($month): string
    {
        $bulan = '';
        switch ($month) {
            case 1:
                $bulan = 'Januari';
                break;
            case 2:
                $bulan = 'Februari';
                break;
            case 3:
                $bulan = 'Maret';
                break;
            case 4:
                $bulan = 'April';
                break;
            case 5:
                $bulan = 'Mei';
                break;
            case 6:
                $bulan = 'Juni';
                break;
            case 7:
                $bulan = 'Juli';
                break;
            case 8:
                $bulan = 'Agustus';
                break;
            case 9:
                $bulan = 'September';
                break;
            case 10:
                $bulan = 'Oktober';
                break;
            case 11:
                $bulan = 'November';
                break;
            case 12:
                $bulan = 'Desember';
                break;
        }

        return $bulan;
    }

    public function exportExcel(Request $request)
    {
        $transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $paid_transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->where('status', 'paid')
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $canceled_transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->where('status', 'canceled')
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $confirmed_transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->where('status', 'confirmed')
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $total_paid = $paid_transactions->sum('total_price');

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $style_title = [
            'font' => [
                'bold' => true,
                'size' => 11
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => array('rgb' => 'dddddd')
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN
                ]
            ]
        ];
        
        $style_subtitle = [
            'font' => [
                'bold' => false,
                'size' => 12
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
        ];
        
        $style_outline_border = [
            'borders' => [
                'outline' => [
                    'borderStyle' => Border::BORDER_THIN
                ]
            ]
        ];
        
        $style_all_border = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN
                ]
            ]
        ];
        
        $style_merge_center = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
        ];
        
        $style_alignment_horizontal_left = [
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
                'wrapText' => true
            ],
        ];

        $style_wrap_text = [
            'alignment' => [
                'wrapText' => true
            ]
        ];
        
        $style_bold = [
            'font' => [
                'bold' => true
            ]
        ];

        $sheet->mergeCells("A1:K2");
        $sheet->setCellValue("A1", "LAPORAN TRANSAKSI " . strtoupper(config('app.name') . " PERIODE " . $this->month($request->month) . " " . $request->year));
        $sheet->getStyle('A1:K2')->applyFromArray($style_title);
        $sheet->getStyle('A1:K2')->applyFromArray($style_outline_border);

        // Printed By
        $sheet->getColumnDimension('M')->setAutoSize(true);
        $sheet->setCellValue("M1", "Printed By");
        $sheet->setCellValue("M2", Auth::user()->name);

        // Summary
        $sheet->mergeCells("A4:C4");
        $sheet->setCellValue("A4", "Jumlah Transaksi Berhasil");
        $sheet->getStyle("A4:C4")->applyFromArray($style_bold);
        $sheet->getStyle("A4:C4")->applyFromArray($style_title);
        $sheet->getStyle("A4:C4")->applyFromArray($style_outline_border);
        $sheet->mergeCells("A5:C5");
        $sheet->setCellValue("A5", count($paid_transactions));
        $sheet->getStyle("A5:C5")->applyFromArray($style_bold);
        $sheet->getStyle("A5:C5")->applyFromArray($style_title);
        $sheet->getStyle("A5:C5")->applyFromArray($style_outline_border);

        $sheet->mergeCells("D4:E4");
        $sheet->setCellValue("D4", "Total Pendapatan");
        $sheet->getStyle("D4:E4")->applyFromArray($style_bold);
        $sheet->getStyle("D4:E4")->applyFromArray($style_title);
        $sheet->getStyle("D4:E4")->applyFromArray($style_outline_border);
        $sheet->mergeCells("D5:E5");
        $sheet->setCellValue("D5", "Rp " . number_format($total_paid, 0, ',', '.'));
        $sheet->getStyle("D5:E5")->applyFromArray($style_bold);
        $sheet->getStyle("D5:E5")->applyFromArray($style_title);
        $sheet->getStyle("D5:E5")->applyFromArray($style_outline_border);

        $sheet->mergeCells("F4:H4");
        $sheet->setCellValue("F4", "Jumlah Transaksi Batal");
        $sheet->getStyle("F4:H4")->applyFromArray($style_bold);
        $sheet->getStyle("F4:H4")->applyFromArray($style_title);
        $sheet->getStyle("F4:H4")->applyFromArray($style_outline_border);
        $sheet->mergeCells("F5:H5");
        $sheet->setCellValue("F5", count($canceled_transactions));
        $sheet->getStyle("F5:H5")->applyFromArray($style_bold);
        $sheet->getStyle("F5:H5")->applyFromArray($style_title);
        $sheet->getStyle("F5:H5")->applyFromArray($style_outline_border);

        $sheet->mergeCells("I4:K4");
        $sheet->setCellValue("I4", "Jumlah Transaksi Belum Selesai");
        $sheet->getStyle("I4:K4")->applyFromArray($style_bold);
        $sheet->getStyle("I4:K4")->applyFromArray($style_title);
        $sheet->getStyle("I4:K4")->applyFromArray($style_outline_border);
        $sheet->mergeCells("I5:K5");
        $sheet->setCellValue("I5", count($confirmed_transactions));
        $sheet->getStyle("I5:K5")->applyFromArray($style_bold);
        $sheet->getStyle("I5:K5")->applyFromArray($style_title);
        $sheet->getStyle("I5:K5")->applyFromArray($style_outline_border);


        // Header
        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getColumnDimension('D')->setAutoSize(true);
        $sheet->getColumnDimension('E')->setAutoSize(true);
        $sheet->getColumnDimension('F')->setAutoSize(true);
        $sheet->getColumnDimension('G')->setAutoSize(true);
        $sheet->getColumnDimension('H')->setAutoSize(true);
        $sheet->getColumnDimension('I')->setAutoSize(true);
        $sheet->mergeCells("A7:A8");
        $sheet->mergeCells("B7:B8");
        $sheet->mergeCells("C7:C8");
        $sheet->mergeCells("D7:D8");
        $sheet->mergeCells("E7:E8");
        $sheet->mergeCells("F7:F8");
        $sheet->mergeCells("G7:G8");
        $sheet->mergeCells("H7:H8");
        $sheet->mergeCells("I7:I8");
        $sheet->mergeCells("J7:M7");
        $sheet->setCellValue("A7", "#");
        $sheet->setCellValue("B7", "No. Invoice");
        $sheet->setCellValue("C7", "Customer");
        $sheet->setCellValue("D7", "Table");
        $sheet->setCellValue("E7", "Tanggal Booking");
        $sheet->setCellValue("F7", "Status");
        $sheet->setCellValue("G7", "Sub Total");
        $sheet->setCellValue("H7", "Tax");
        $sheet->setCellValue("I7", "Total");
        $sheet->setCellValue("J7", "Detail Pesanan");
        $sheet->setCellValue("J8", "Menu");
        $sheet->setCellValue("K8", "Jumlah");
        $sheet->setCellValue("L8", "Harga");
        $sheet->setCellValue("M8", "Sub Total");
        $sheet->getStyle("A7:M7")->applyFromArray($style_title);
        $sheet->getStyle("J8:M8")->applyFromArray($style_subtitle);
        $sheet->getStyle("A7:M8")->applyFromArray($style_all_border);

        $i = 9;
        foreach ($transactions as $key => $transaction) {
            $sheet->setCellValue("A$i", $key + 1);
            $sheet->setCellValue("B$i", $transaction->invoice_number);
            $sheet->setCellValue("C$i", $transaction->user->name);
            $sheet->setCellValue("D$i", $transaction->table->name);
            $sheet->setCellValue("E$i", Carbon::parse($transaction->booking_start)->format('d-m-Y H:i'));
            $sheet->setCellValue("F$i", strtoupper($transaction->status));
            $sheet->setCellValue("G$i", "Rp " . number_format($transaction->subtotal_price, 0, ',', '.'));
            $sheet->setCellValue("H$i", "Rp " . number_format($transaction->tax, 0, ',', '.'));
            $sheet->setCellValue("I$i", "Rp " . number_format($transaction->total_price, 0, ',', '.'));
            $sheet->getStyle("A$i:M$i")->applyFromArray($style_all_border);
            
            foreach ($transaction->details as $key => $detail) {
                $sheet->setCellValue("J$i", $detail->menu->name);
                $sheet->setCellValue("K$i", $detail->quantity);
                $sheet->setCellValue("L$i", $detail->price);
                $sheet->setCellValue("M$i", $detail->subtotal);
                $sheet->getStyle("J$i:M$i")->applyFromArray($style_all_border);

                $i++;
            }

            $i++;
        }

        // Proteksi sheet agar tidak bisa diedit
        $protection = $sheet->getProtection();
        $protection->setSheet(true); // Aktifkan proteksi
        $protection->setPassword(env('EXCEL_PASSWORD')); // Password dari .env

        $writer = new Xlsx($spreadsheet);

        $response = new StreamedResponse(function() use ($writer) {
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="Laporan Pengajuan Transaksi ' . env('APP_NAME') . ' ' . Carbon::now()->format('d-m-Y') .'.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');
        return $response;
    }

    public function exportPdf(Request $request)
    {
        $transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $paid_transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->where('status', 'paid')
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $canceled_transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->where('status', 'canceled')
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $confirmed_transactions = Transaction::with(['user', 'table', 'details.menu'])
                        ->whereMonth('booking_start', $request->month)
                        ->whereYear('booking_start', $request->year)
                        ->where('status', 'confirmed')
                        ->orderBy('booking_start', 'desc')
                        ->get();
        $total_paid = $paid_transactions->sum('total_price');
        $bulan = $request->month;
        $tahun = $request->year;

        $pdf = Pdf::loadView('report.pdf', compact('transactions', 'paid_transactions', 'canceled_transactions', 'confirmed_transactions', 'total_paid', 'bulan', 'tahun'));

        return $pdf->stream('Laporan_Transaksi_' . env('APP_NAME') . '_' . Carbon::now()->format('d-m-Y') . '.pdf');
    }
}
