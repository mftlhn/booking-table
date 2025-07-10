import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import React, { useState } from 'react'

const AddImage = ({ onSubmit }) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null)

    const handleSubmit = () => {
    if (!file) return alert("Pilih gambar terlebih dahulu.")
        onSubmit(file)
        setFile(null)
        setOpen(false)
    }

    return (
        <Dialog
            open={open} 
            onOpenChange={(event) => {
                setOpen(event);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="">
                    Tambah Gambar
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-11/12 h-1/2 lg:h-1/2 lg:w-1/4  overflow-y-auto" 
                onInteractOutside={(event) => event.preventDefault()} 
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                {/* <DialogTitle>Tambah Menu</DialogTitle> */}
                <div className="w-full overflow-auto mt-5">
                    <div className="flex">
                        <div>
                            <Label>Nama</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                placeholder="Masukkan nama menu"
                                className="mt-1"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        setFile(e.target.files[0])
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {file && (
                        <div className="mt-2">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded"
                            />
                        </div>
                    )}
                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                        <Button onClick={handleSubmit}>Tambahkan</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddImage