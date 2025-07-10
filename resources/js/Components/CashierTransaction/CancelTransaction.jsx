import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Textarea } from '@/shadcn/ui/textarea';
import { useForm } from '@inertiajs/react';
import { LucideEye, LucideEyeClosed } from 'lucide-react';
import numeral from 'numeral';
import React, { useState } from 'react'

const CancelTransaction = ({ transaction }) => {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        id: transaction.id,
        canceled_reason: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        
        post(route('cashier.cancel'), {
            onSuccess: () => {
                reset()
                setOpen(false)
                window.location.reload();
            },
        })
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
                <Button variant="destructive">
                    Batal
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-1/2 lg:w-1/2 max-w-full h-1/2 overflow-y-auto" 
                onInteractOutside={(event) => event.preventDefault()} 
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                <div className="w-full overflow-auto mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4 px-2 mt-6">
                            <div>
                                <Label>Alasan Batal</Label>
                                <Textarea
                                    value={data.canceled_reason}
                                    onChange={(e) => setData('canceled_reason', e.target.value)}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-10">
                            <Button className="w-full" variant="destructive" type="submit" disabled={processing}>
                                Batalkan
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CancelTransaction