import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import { LucideEye, LucideEyeClosed } from 'lucide-react';
import React, { useState } from 'react'
import Select from 'react-select';

const AddTable = () => {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('tables.store'), {
            onFinish: () => {
                reset()
                setOpen(false)
            },
        });
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
                <Button variant="outline" className="">
                    Tambah
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-11/12 lg:w-1/4 max-w-full h-1/3 overflow-y-auto" 
                onInteractOutside={(event) => event.preventDefault()} 
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                <div className="w-full overflow-auto mt-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 px-2">
                            <div>
                                <Label>Nama</Label>
                                <Input
                                    type="text"
                                    placeholder="Nama meja"
                                    className="mt-1"
                                    onChange={(e) => setData('name', e.target.value)}
                                    value={data.name}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6 flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddTable