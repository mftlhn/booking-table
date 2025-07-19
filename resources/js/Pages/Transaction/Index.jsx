import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table'
import { Button } from '@/shadcn/ui/button'
import { ChevronLeft, ChevronRight, Edit, Image, LucidePlusSquare, Trash } from 'lucide-react'
import Select from 'react-select'
import { Input } from '@/shadcn/ui/input'
import { useSearch } from '@/hooks/useSearch'
import { usePagination } from '@/hooks/usePagination'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import numeral from 'numeral'
import CashierPay from '@/Components/CashierTransaction/CashierPay'
import CancelTransaction from '@/Components/CashierTransaction/CancelTransaction'
dayjs.locale('id')

const Index = ({ ...props }) => {
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState({
        value: 'confirmed',
        label: 'CONFIRMED',
    })
    const status = [
        { value: 'confirmed', label: 'CONFIRMED' },
        { value: 'paid', label: 'PAID' },
        { value: 'canceled', label: 'CANCELED' },
    ]

    const filteredTransactions = selectedStatus
        ? props.transactions.filter(t => t.status === selectedStatus.value)
        : props.transactions

    const handleSelectTransaction = (transaction) => {
        if (selectedTransaction?.id === transaction.id) {
            setSelectedTransaction(null)
        } else {
            setSelectedTransaction(transaction)
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Transaksi
                </h2>
            }
            appName={props.appName}
        >
            <Head title="Transaksi" />

            <div className="p-5 ">
                {/* <div className="mx-auto max-w-7xl sm:px-6 lg:px-8"> */}
                    <div className="flex min-h-[80vh] rounded gap-4 overflow-hidden">
                        {/* Kolom kiri */}
                        <div className="w-[350px] h-[80vh] bg-white shadow-lg overflow-y-auto p-4 flex-col">
                            <div className='flex items-center justify-center border bg-gray-300 rounded-sm py-2'>
                                {dayjs().format('DD-MM-YYYY')}
                            </div>
                            {
                                props.transactions.length < 1 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Card className="w-full p-6 text-center">
                                            <p className="text-gray-500">Tidak ada transaksi yang ditemukan.</p>
                                        </Card>
                                    </div>
                                ) : (
                                    <>
                                        <div className="my-6 border shadow-md flex flex-col gap-2 justify-start p-4 rounded-sm">
                                            <p className="text-gray-500 text-sm font-semibold">Filter :</p>
                                            <Select
                                                options={status}
                                                placeholder="Status"
                                                isClearable
                                                isSearchable={false}
                                                value={selectedStatus}
                                                onChange={setSelectedStatus}
                                            />
                                        </div>
                                        {
                                            filteredTransactions.map((transaction) => {
                                                const isSelected = selectedTransaction?.id === transaction.id
                                                return (
                                                    <Card
                                                        key={transaction.id}
                                                        onClick={() => handleSelectTransaction(transaction)}
                                                        className={`${
                                                            isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
                                                        } cursor-pointer mb-4 rounded transition duration-200 mt-5`}
                                                    >
                                                        <CardHeader>
                                                            <CardTitle>{transaction.invoice_number}</CardTitle>
                                                            <CardDescription>
                                                                <div className="flex justify-between">
                                                                    <span className='text-sm text-gray-500'>
                                                                        {transaction.table.name}
                                                                    </span>
                                                                    <span className='font-semibold text-gray-500'>
                                                                        {transaction.user.name}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-end uppercase mt-1">
                                                                    <span className='text-sm text-gray-500'>
                                                                        {dayjs(transaction.booking_start).format('dddd DD-MM-YYYY HH:mm')}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-center uppercase mt-4">
                                                                    <span 
                                                                        className={`${
                                                                            transaction.status === 'paid' ? 'text-green-500' : 
                                                                            transaction.status === 'confirmed' ? 'text-yellow-500' : 
                                                                            'text-red-500'}`}
                                                                    >
                                                                        {transaction.status}
                                                                    </span>
                                                                </div>
                                                            </CardDescription>
                                                        </CardHeader>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </>
                                )
                            }
                        </div>

                        {/* Kolom kanan */}
                        <div className="flex-1 h-[80vh] bg-white p-4 shadow-lg overflow-y-auto">
                            {selectedTransaction ? (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Transaksi</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='p-1 border-b'>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500">Invoice Number :</p>
                                                <p>{selectedTransaction.invoice_number}</p>
                                            </div>
                                        </div>
                                        <div className='p-1 border-b'>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500">Nama Customer :</p>
                                                <p>{selectedTransaction.user.name}</p>
                                            </div>
                                        </div>
                                        <div className='p-1 border-b'>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500">Nomor Meja :</p>
                                                <p>{selectedTransaction.table.name}</p>
                                            </div>
                                        </div>
                                        <div className='p-1 border-b'>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500">Tanggal Booking :</p>
                                                <p>{dayjs(selectedTransaction.booking_start).format('dddd, DD/MM/YYYY  HH:mm')}</p>
                                            </div>
                                        </div>
                                        <div className='p-1 border-b'>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500">Nama Kasir :</p>
                                                <p>{selectedTransaction.cashier?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mt-10 mb-4">Detail Pesanan</h3>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Menu
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Harga
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Qty
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='bg-white divide-y divide-gray-200'>
                                            {
                                                selectedTransaction.details.map((detail) => (
                                                    <tr key={detail.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-900">
                                                            {detail.menu.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap  text-right text-sm text-gray-900">
                                                            Rp {numeral(detail.price).format('0,0')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                            {detail.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                            Rp {numeral(detail.subtotal).format('0,0')}
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <h3 className="text-xl font-bold mt-10 mb-4">Total Pembayaran</h3>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tr>
                                            <th className="px-6 bg-gray-100 py-3 w-[80%] text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Harga
                                            </th>
                                            <td className="px-6 py-4 whitespace-nowrap border border-gray-100 text-right text-sm text-gray-900">
                                                Rp {numeral(selectedTransaction.subtotal_price).format('0,0')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="px-6 bg-gray-100 py-3 w-[80%] text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pajak (PB1 10%)
                                            </th>
                                            <td className="px-6 py-4 whitespace-nowrap border border-gray-100 text-right text-sm text-gray-900">
                                                Rp {numeral(selectedTransaction.tax).format('0,0')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="px-6 bg-gray-100 py-3 w-[80%] text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Bayar Customer
                                            </th>
                                            <td className="px-6 py-4 whitespace-nowrap border border-gray-100 text-right text-sm text-gray-900">
                                                Rp {numeral(selectedTransaction.total_price).format('0,0')}
                                            </td>
                                        </tr>
                                        {
                                            selectedTransaction.status === 'paid' && (
                                                <>
                                                    <tr>
                                                        <th className="px-6 bg-red-300 py-3 w-[80%] text-right text-xs font-medium text-white uppercase tracking-wider">
                                                            Customer Bayar
                                                        </th>
                                                        <td className="px-6 py-4 whitespace-nowrap border border-gray-100 text-right text-sm text-gray-900">
                                                            Rp {numeral(selectedTransaction.customer_payment).format('0,0')}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className="px-6 bg-red-300 py-3 w-[80%] text-right text-xs font-medium text-white uppercase tracking-wider">
                                                            Kembalian
                                                        </th>
                                                        <td className="px-6 py-4 whitespace-nowrap border border-gray-100 text-right text-sm text-gray-900">
                                                            Rp {numeral(selectedTransaction.change).format('0,0')}
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                    </table>
                                    {
                                        selectedTransaction.status === 'canceled' && (
                                            <>
                                                <h3 className='text-xl font-bold mt-10 mb-4'>Alasan Batal</h3>
                                                <p className="text-gray-500 text-sm">{selectedTransaction.canceled_reason}</p>
                                            </>
                                        )
                                    }
                                    {
                                        selectedTransaction.status === 'confirmed' && (
                                            <div className="flex mt-10 justify-end gap-2">
                                                <CancelTransaction transaction={selectedTransaction} />
                                                <CashierPay transaction={selectedTransaction} />
                                            </div>
                                        ) 
                                    }
                                </div>
                            ) : (
                                <p className="text-gray-500">Pilih transaksi di sebelah kiri untuk melihat detail.</p>
                            )}
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </AuthenticatedLayout>
    )
}

export default Index