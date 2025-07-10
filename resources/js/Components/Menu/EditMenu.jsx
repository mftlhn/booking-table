import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/ui/dialog'
import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'
import { Textarea } from '@/shadcn/ui/textarea'
import { router, useForm } from '@inertiajs/react'
import numeral from 'numeral'
import React, { useState } from 'react'
import Select from 'react-select'
import AddImage from './AddImage'
import { Edit, LucideTrash } from 'lucide-react'

const EditMenu = ({ menu }) => {
    const [open, setOpen] = useState(false);
    const [existingImages, setExistingImages] = useState(menu.images || []);
    const categoryOptions = [
        { value: 'appetizer', label: 'Makanan Pembuka' },
        { value: 'main_course', label: 'Makanan Utama' },
        { value: 'dessert', label: 'Makanan Penutup' },
        { value: 'beverage', label: 'Minuman' },
    ];
    const { data, setData, post, processing, errors, reset } = useForm({
        name: menu.name || '',
        category: menu.category || '',
        price: menu.price ? numeral(menu.price).format('0,0') : '0',
        description: menu.description || '',
        new_images: [] // pastikan images adalah array
    })
    
    const handleAddImage = (file) => {
        setData("new_images", [...data.new_images, file]);
    };

    const handleRemoveImage = (index) => {
        setData("new_images", data.images.filter((_, i) => i !== index));
    };
    const handleDeleteExistingImage = (imageId) => {
        if (confirm('Yakin ingin menghapus gambar ini?')) {
            post(`/admin/menus/image/${imageId}/delete`, {
                onSuccess: () => {
                    setExistingImages(existingImages.filter((img) => img.id !== imageId));
                },
                onError: (err) => {
                    console.error('Gagal menghapus gambar:', err);
                },
            });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault()
        // Bersihkan price dari format numeral
        const payload = {
            ...data,
            price: data.price.toString().replace(/,/g, ''),
        };
        post(`/admin/menus/${menu.id}/update`, {
            data: payload,
            forceFormData: true, // ⬅️ penting! agar images dikirim sebagai FormData
            onSuccess: () => {
                reset()
                setExistingImages([]); // opsional, tergantung behavior yg diinginkan
                setOpen(false);
            },
            onError: (err) => {
                console.error(err)
            },
        })
    }

    const getSelectedCategory = () => {
        return categoryOptions.find((opt) => opt.value === data.category);
    };
    return (
        <Dialog
            open={open} 
            onOpenChange={(event) => {
                setOpen(event);
                reset();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mr-2">
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="w-11/12 lg:w-1/2 max-w-full h-[90%] overflow-y-auto" 
                onInteractOutside={(event) => event.preventDefault()} 
                onEscapeKeyDown={(event) => event.preventDefault()}
            >
                {/* <DialogTitle>Tambah Menu</DialogTitle> */}
                <div className="w-full overflow-auto mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <Label>Nama</Label>
                                <Input
                                    type="text"
                                    placeholder="Nama menu"
                                    className="mt-1"
                                    onChange={(e) => setData('name', e.target.value)}
                                    value={data.name}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Kategori</Label>
                                <Select
                                    options={categoryOptions}
                                    value={getSelectedCategory()}
                                    onChange={(opt) => setData('category', opt.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Harga</Label>
                                <div className="relative">
                                    <div className="absolute left-2 top-1/2 mr-2 transform -translate-y-1/2">
                                        Rp
                                    </div>
                                    <Input
                                        type="text"
                                        className="pl-8"
                                        value={numeral(data.price).format('0,0')}
                                        onChange={(e) => {
                                            const raw = e.target.value.replaceAll(',', '');
                                            if (!isNaN(raw)) setData('price', raw);
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid-cols-1 mt-4">
                            <div>
                                <Label>Deskripsi</Label>
                                <Textarea
                                    placeholder="Masukkan deskripsi menu"
                                    className="mt-1"
                                    onChange={(e) => setData('description', e.target.value)}
                                    value={data.description}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <Label>Gambar Lama</Label>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative">
                                        <img
                                            src={`/storage/public/${img.image_path}`} // pastikan ini URL full, misal: '/storage/menus/abc.jpg'
                                            alt="preview"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteExistingImage(img.id)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <LucideTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between">
                                <Label>Gambar Baru</Label>
                                <AddImage onSubmit={handleAddImage} />
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {data.new_images.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <LucideTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* <div className="mt-6 flex justify-end">
                            <AddImage onSubmit={handleAddImage} />
                        </div>
                        <div className="mt-6">
                            <div className="flex flex-wrap gap-4">
                                {data.images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={URL.createObjectURL(img)} alt="preview" className="w-24 h-24 object-cover rounded" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <LucideTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div> */}
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

export default EditMenu