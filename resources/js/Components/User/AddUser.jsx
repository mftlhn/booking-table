import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm } from '@inertiajs/react';
import { LucideEye, LucideEyeClosed } from 'lucide-react';
import React, { useState } from 'react'
import Select from 'react-select';

const AddUser = ({ roles }) => {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        password_confirmation: '',
    })
    const passwordsMatch = data.password === data.password_confirmation

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('users.store'), {
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
                className="w-11/12 lg:w-1/2 max-w-full h-[60%] overflow-y-auto" 
                onInteractOutside={(event) => event.preventDefault()} 
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                {/* <DialogTitle>Tambah Menu</DialogTitle> */}
                <div className="w-full overflow-auto mt-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2">
                            <div>
                                <Label>Nama</Label>
                                <Input
                                    type="text"
                                    placeholder="Nama user"
                                    className="mt-1"
                                    onChange={(e) => setData('name', e.target.value)}
                                    value={data.name}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="text"
                                    placeholder="Email user"
                                    className="mt-1"
                                    onChange={(e) => setData('email', e.target.value)}
                                    value={data.email}
                                    required
                                />
                            </div>
                            {/* Password */}
                            <div>
                                <Label>Password</Label>
                                <div className="relative mt-1">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        className="pr-10"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <div
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <LucideEyeClosed className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <LucideEye className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <Label>Konfirmasi Password</Label>
                                <div className="relative mt-1">
                                    <Input
                                        type={showConfirm ? 'text' : 'password'}
                                        className="pr-10"
                                        value={data.password_confirmation || ''}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <div
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? (
                                            <LucideEyeClosed className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <LucideEye className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                                {!passwordsMatch && data.password_confirmation && (
                                    <p className="text-sm text-red-600 mt-1">
                                        Konfirmasi password tidak cocok.
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label>Role</Label>
                                <Select
                                    options={roles.map(role => ({
                                        value: role.name,
                                        label: role.name
                                    }))}
                                    className="mt-1"
                                    placeholder="Pilih role"
                                    onChange={(e) => setData('role', e.value)}
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

export default AddUser