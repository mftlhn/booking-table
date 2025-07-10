import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/ui/dialog'
import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'
import { Textarea } from '@/shadcn/ui/textarea'
import { useForm } from '@inertiajs/react'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { LucideHistory, LucideTrash } from 'lucide-react'
import axios from 'axios'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion'
import dayjs from 'dayjs'
import { Badge } from '@/shadcn/ui/badge'

const HistoryPesanan = ({ userId }) => {
    const [open, setOpen] = useState(false);
    const [histories, setHistories] = useState([]);

    useEffect(() => {
        if (open) {
            axios.get(`/transaction/${userId}`)
            .then(response => {
                // console.log(response.data);
                setHistories(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, [userId, open]);

    return (
        <Dialog
            open={open} 
            onOpenChange={(event) => {
                setOpen(event);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="">
                    <LucideHistory /> History
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-11/12 lg:w-1/2 max-w-full h-[90%] overflow-y-auto" 
                onInteractOutside={(event) => event.preventDefault()} 
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                <div className="w-full overflow-auto mt-5">
                    <h3 className='text-2xl font-bold mb-5'>History Pesanan</h3>
                    <Accordion type="single" collapsible>
                        {
                            histories.map((history, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="w-full">
                                    <AccordionTrigger className="w-full hover:no-underline hover:bg-gray-50 px-2">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center">
                                                <LucideHistory className="mr-2 h-6 w-6" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium leading-none">{history.invoice_number}</span>
                                                    <span className="text-xs text-muted-foreground">{dayjs(history.booking_start).format('DD MMMM YYYY HH:mm')}</span>
                                                </div>
                                            </div>
                                            <Badge 
                                                variant='outline'
                                                className={`uppercase
                                                    ${history.status === 'confirmed' ? 'border-yellow-500 text-yellow-500' :
                                                    history.status === 'paid' ? 'border-green-500 text-green-500' :
                                                    history.status === 'canceled' ? 'border-red-500 text-red-500' : ''}
                                                    `
                                                }
                                            >
                                                {history.status}
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="w-full py-2 px-4">
                                        <div className="grid grid-cols-3 p-2">
                                            <div className='flex justify-start text-sm'>
                                                <span className='text-gray-500'>Pilihan Meja :</span>
                                                <span className='ml-2'>{history.table.name}</span>
                                            </div>
                                            <div className='flex justify-start text-sm'>
                                                <span className='text-gray-500'>No. Invoice :</span>
                                                <span className='ml-2'>{history.invoice_number}</span>
                                            </div>
                                            <div className='flex justify-start text-sm'>
                                                <span className='text-gray-500'>Tanggal Booking :</span>
                                                <span className='ml-2'>{dayjs(history.booking_start).format('DD MMMM YYYY HH:mm')}</span>
                                            </div>
                                        </div>
                                        <p className='text-lg font-bold my-2'>Detail Pesanan</p>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nama
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Qty
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Harga
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Sub Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {
                                                    history.details.map((detail, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {detail.menu.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {detail.quantity}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                Rp {numeral(detail.price).format('0,0')}
                                                            </td>
                                                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                                                                Rp {numeral(detail.subtotal).format('0,0')}
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                            {
                                                history.status === 'paid' && (
                                                    <tfoot className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" colSpan={3} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Total
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Rp {numeral(history.subtotal_price).format('0,0')}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" colSpan={3} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Tax PB1 (10%)
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Rp {numeral(history.tax).format('0,0')}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" colSpan={3} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Total Bayar
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Rp {numeral(history.total_price).format('0,0')}
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                )
                                            }
                                        </table>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        }
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default HistoryPesanan