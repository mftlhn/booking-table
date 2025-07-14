import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table'
import { Button } from '@/shadcn/ui/button'
import { ChevronLeft, ChevronRight, Edit, Image, LucidePlusSquare, LucideSearch, Trash } from 'lucide-react'
import Select from 'react-select'
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { Input } from '@/shadcn/ui/input'
import { useSearch } from '@/hooks/useSearch'
import { usePagination } from '@/hooks/usePagination'
import axios from 'axios'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip'

const Index = ({ ...props }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const now = new Date();

    const { page, limit, maxPage, paginatedData, handlePageChange, handleLimitChange } = usePagination(transactions);
    const years = [
        { value: now.getFullYear(), label: now.getFullYear() },
        { value: now.getFullYear() - 1, label: now.getFullYear() - 1 },
        { value: now.getFullYear() - 2, label: now.getFullYear() - 2 },
    ]

    const handleSearch = () => {
        if (!selectedMonth || !selectedYear) return alert('Bulan dan tahun wajib dipilih.');

        setLoading(true);
        axios.get(`/admin/search-reports/${selectedMonth}/${selectedYear}`)
            .then(response => {
                setTransactions(response.data);
                // console.log('Search result:', response.data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleExportExcel = () => {
        if (!selectedMonth || !selectedYear) return alert('Bulan dan tahun wajib dipilih.');

        window.location.href = `/admin/export-reports-excel?month=${selectedMonth}&year=${selectedYear}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Reports
                </h2>
            }
            appName={props.appName}
        >
            <Head title="Reports" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden h-[80vh] bg-white shadow-sm sm:rounded-lg">
                        {/* <div className="flex justify-end p-6 text-gray-900">
                            <AddMenu />
                        </div> */}
                        <div className="flex flex-col-reverse lg:flex-row p-4 gap-2 lg:gap-0 justify-between mb-4">
                            <div className="flex flex-col gap-2 lg:flex-row items-end space-x-4">
                                <Select
                                    options={
                                        [
                                            { value: 1, label: 'Januari' },
                                            { value: 2, label: 'Februari' },
                                            { value: 3, label: 'Maret' },
                                            { value: 4, label: 'April' },
                                            { value: 5, label: 'Mei' },
                                            { value: 6, label: 'Juni' },
                                            { value: 7, label: 'Juli' },
                                            { value: 8, label: 'Agustus' },
                                            { value: 9, label: 'September' },
                                            { value: 10, label: 'Oktober' },
                                            { value: 11, label: 'November' },
                                            { value: 12, label: 'Desember' },
                                        ]
                                    }
                                    isSearchable={false}
                                    placeholder="Bulan"
                                    onChange={(e) => setSelectedMonth(e.value)}
                                    className="w-36"
                                />
                                <Select
                                    options={years}
                                    isSearchable={false}
                                    placeholder="Tahun"
                                    onChange={(e) => setSelectedYear(e.value)}
                                    className="w-36"
                                />
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    onClick={handleSearch}
                                >
                                    <LucideSearch className="w-4 h-4 mr-2" />
                                    Cari
                                </Button>
                            </div>
                            <div className='flex flex-col items-end'>
                            </div>
                        </div>
                        {
                            paginatedData.length > 0 && (
                                <div className="flex justify-end gap-2 m-4">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={handleExportExcel}
                                            >
                                                <FaFileExcel className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Unduh Laporan Excel</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a 
                                                href={`/admin/export-reports-pdf?month=${selectedMonth}&year=${selectedYear}`}
                                                target='_blank'
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    if (!selectedMonth || !selectedYear) {
                                                        e.preventDefault();
                                                        alert('Bulan dan tahun wajib dipilih.');
                                                    }
                                                }}
                                            >
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                >
                                                    <FaFilePdf className="w-4 h-4" />
                                                </Button>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Unduh Laporan PDF</TooltipContent>
                                    </Tooltip>
                                </div>
                            )
                        }
                        <Table className="border rounded-lg">
                            <TableCaption>List Transaksi</TableCaption>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="w-[75px] text-center">#</TableHead>
                                    <TableHead className="text-center">No. Invoice</TableHead>
                                    <TableHead className="text-center">Customer</TableHead>
                                    <TableHead className="text-center">Table</TableHead>
                                    <TableHead className="text-center">Tanggal Booking</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-center">Sub Total</TableHead>
                                    <TableHead className="text-center">Tax</TableHead>
                                    <TableHead className="text-center">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    loading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center">Mencari data transaksi . . .</TableCell>
                                        </TableRow>
                                    ) :
                                    paginatedData.length === 0 ? (
                                        <TableRow key={1}>
                                            <TableCell colSpan={9} className="text-center">Tidak ada data</TableCell>
                                        </TableRow>
                                    ) :
                                    (
                                        paginatedData.map((transaction, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{(page - 1) * limit + index + 1}</TableCell>
                                                <TableCell className="text-center">{transaction.invoice_number}</TableCell>
                                                <TableCell className="text-center">{transaction.user.name}</TableCell>
                                                <TableCell className="text-center">{transaction.table.name}</TableCell>
                                                <TableCell className="text-center">{dayjs(transaction.booking_start).format('DD-MM-YYYY HH:mm')}</TableCell>
                                                <TableCell className="text-center uppercase">{transaction.status}</TableCell>
                                                <TableCell className="text-center">Rp {numeral(transaction.subtotal_price).format('0,0.00')}</TableCell>
                                                <TableCell className="text-center">Rp {numeral(transaction.tax).format('0,0.00')}</TableCell>
                                                <TableCell className="text-center">Rp {numeral(transaction.total_price).format('0,0.00')}</TableCell>
                                            </TableRow>
                                        ))
                                    )
                                }
                                {/* <TableRow>
                                    <TableCell className="font-medium">INV001</TableCell>
                                    <TableCell>Paid</TableCell>
                                    <TableCell>Credit Card</TableCell>
                                    <TableCell className="text-right">$250.00</TableCell>
                                </TableRow> */}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end mt-5 p-4">
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="rounded-full px-3 py-3"
                                >
                                    <ChevronLeft />
                                </Button>
                                <span className="text-sm font-semibold">
                                    {page} of {maxPage}
                                </span>
                                <Button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === maxPage}
                                    className="rounded-full px-3 py-3"
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default Index