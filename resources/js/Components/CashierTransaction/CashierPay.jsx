import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import numeral from 'numeral';
import React, { useState } from 'react'

const CashierPay = ({ transaction }) => {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        id: transaction.id,
        charge: transaction.total_price,
        customer_payment: '0',
        change: '0',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        
        post(route('cashier.pay'), {
            onSuccess: () => {
                reset()
                setOpen(false)
                window.location.reload();
            },
        })
    }

    const handleChange = (e) => {
        const input = e.target.value.replace(/,/g, ''); // hilangkan koma
        const payment = parseFloat(input) || 0;
        const change = payment - transaction.total_price;

        setData('customer_payment', payment);
        setData('change', change > 0 ? change : 0);
    }

    return (
        <Dialog
            open={open} 
            onOpenChange={(event) => {
                setOpen(event);
                reset();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="submit">
                    Bayar
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-1/2 lg:w-1/2 max-w-full h-[60%] overflow-y-auto" 
                onInteractOutside={(event) => event.preventDefault()} 
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                <div className="w-full overflow-auto mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 px-2 mt-6">
                            <div>
                                <Label>Total Harga</Label>
                                <div className="relative bg-gray-100">
                                    <div className="absolute left-2 top-1/2 mr-2 transform -translate-y-1/2">
                                        Rp
                                    </div>
                                    <Input
                                        value={numeral(transaction.subtotal_price).format('0,0')}
                                        className="pl-8"
                                        inputMode="numeric"
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Pajak PB1 (10%)</Label>
                                <div className="relative bg-gray-100">
                                    <div className="absolute left-2 top-1/2 mr-2 transform -translate-y-1/2">
                                        Rp
                                    </div>
                                    <Input
                                        value={numeral(transaction.tax).format('0,0')}
                                        className="pl-8"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 px-2 mt-4">
                            <div>
                                <Label>Total Pembayaran</Label>
                                <div className="relative bg-gray-100">
                                    <div className="absolute left-2 top-1/2 mr-2 transform -translate-y-1/2">
                                        Rp
                                    </div>
                                    <Input
                                        value={numeral(transaction.total_price).format('0,0')}
                                        className="pl-8"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 px-2 mt-10">
                            <div>
                                <Label>Uang Bayar</Label>
                                <div className="relative">
                                    <div className="absolute left-2 top-1/2 mr-2 transform -translate-y-1/2">
                                        Rp
                                    </div>
                                    <Input
                                        value={numeral(data.customer_payment).format('0,0')}
                                        className="pl-8"
                                        inputMode="numeric"
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Uang Kembali</Label>
                                <div className="relative">
                                    <div className="absolute left-2 top-1/2 mr-2 transform -translate-y-1/2">
                                        Rp
                                    </div>
                                    <Input
                                        value={numeral(data.change).format('0,0')}
                                        className="pl-8"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button className="w-full" variant="submit" type="submit" disabled={processing}>
                                Bayar
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CashierPay