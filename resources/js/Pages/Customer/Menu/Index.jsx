import Header from '@/Components/Customer/Header'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion'
import { Button } from '@/shadcn/ui/button'
import { Card, CardHeader } from '@/shadcn/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/shadcn/ui/carousel'
import { Head, router, useForm } from '@inertiajs/react'
import Autoplay from 'embla-carousel-autoplay'
import { Trash } from 'lucide-react'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast';
import HistoryPesanan from '@/Components/Customer/HistoryPesanan'

const Index = ({ ...props }) => {
    useEffect(() => {
        if (props.flash?.success) {
            alert(props.flash.success);
            router.visit(window.location.href);
        }

        if (props.flash?.error) {
            alert(props.flash.error);
        }
    }, [props.flash]);
    const categories = [
        { value: 'appetizer', label: 'Makanan Pembuka' },
        { value: 'main_course', label: 'Makanan Utama' },
        { value: 'dessert', label: 'Makanan Penutup' },
        { value: 'beverage', label: 'Minuman' }
    ]
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedTable, setSelectedTable] = useState(null)
    const [tables, setTables] = useState([])
    const [existingItems, setExistingItems] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        booking_start: '',
        table_id: null,
        items: [],
    })
    

    // Fetch meja tersedia saat booking_start berubah
    useEffect(() => {
        if (data.booking_start) {
            axios.post('/check-available-tables', {
                booking_start: data.booking_start,
            }).then(response => {                
                setTables(response.data)
            }).catch(err => {
                console.error(err)
            })
        } else {
            setTables([])
        }
    }, [data.booking_start])

    const handleTableSelect = (id) => {
        if (data.table_id === id) {
            setData('table_id', null); // batal pilih meja
            setSelectedTable(null);
        } else {
            setData('table_id', id); // pilih meja
            setSelectedTable(id);
        }
    }

    const handleFilter = (value) => {
        setSelectedCategory(prev =>
            prev === value ? null : value
        )
    }

    const filteredMenus = selectedCategory
        ? props.menus.filter(menu => menu.category === selectedCategory)
        : props.menus

    const handleAddToCart = (menu) => {
        const targetCart = props.existingTransaction ? existingItems : data.items;
        const setter = props.existingTransaction ? setExistingItems : (items) => setData('items', items);

        const exists = targetCart.find(item => item.menu_id === menu.id);

        if (exists) {
            const updated = targetCart.map(item =>
                item.menu_id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setter(updated);
        } else {
            const newItem = {
                menu_id: menu.id,
                name: menu.name,
                quantity: 1,
                price: menu.price,
            };
            setter([...targetCart, newItem]);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.existingTransaction) {
            router.post('/transaction/update-confirmed', {
                booking_id: props.existingTransaction.id,
                items: existingItems,
            }, {
                onSuccess: () => {
                    setExistingItems([]);
                }
            });
        } else {
            if (!data.table_id || data.items.length === 0) {
                alert("Pilih meja dan isi pesanan terlebih dahulu.");
                return;
            }

            post('transaction', {
                onSuccess: () => {
                    // console.log(props.flash);
                    
                    if (props.flash?.success) {
                        alert(props.flash.success);
                    } 
                    if (props.flash?.error) {
                        alert(props.flash.error);
                    }
                    reset();
                    router.visit(window.location.href)
                    // window.location.reload()
                },
                onError: () => {
                    if (props.flash?.error) {
                        toast({
                            title: 'Error',
                            description: props.flash.error,
                            status: 'error',
                            variant: 'destructive',
                        });
                    }
                }
            });
        }
    }

    const handleRemoveFromCart = (menuId) => {
        if (props.existingTransaction) {
            setExistingItems(existingItems.filter(item => item.menu_id !== menuId));
        } else {
            setData('items', data.items.filter(item => item.menu_id !== menuId));
        }
    }

    // const cartTotal = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const cartTotal = props.existingTransaction
        ? existingItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
        : data.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <>
            <Head title="Semua Menu" />
            <div className="bg-white text-gray-800 py-4">
                <Header auth={props.auth} />
                <div className="mt-8 flex flex-row justify-center items-center gap-4 px-2 mx-auto">
                    {/* KOLOM KIRI */}
                    <div className="h-[80vh] w-[70%] bg-gray-50 mx-auto rounded-md border-gray-700 border p-4 flex flex-col">
                        <div className="flex justify-between">
                            <h3 className='text-xl font-bold mb-4'>Kategori Menu</h3>
                            <HistoryPesanan userId={props.auth.user.id} />
                        </div>
                        <div className="h-[15%] w-full overflow-y-auto bg-white rounded-md p-4 flex flex-row justify-center items-center gap-2">
                            {
                                categories.map((category, index) => (
                                    <Button
                                        key={index} 
                                        className={`w-fit ${
                                            selectedCategory === category.value
                                            ? 'bg-red-700 hover:bg-red-800'
                                            : 'bg-red-500 hover:bg-red-600'
                                        } text-white`}
                                        onClick={() => handleFilter(category.value)}
                                    >
                                        {category.label}
                                    </Button>
                                ))
                            }
                        </div>
                        <div className="mt-4 flex-1 w-full flex-wrap overflow-x-auto bg-white rounded-md p-4 flex flex-row justify-center items-center gap-4">
                            {filteredMenus.map((item, index) => (
                                <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 mt-2 w-[200px]">
                                    <Carousel
                                        opts={
                                        {
                                            loop: true,
                                            speed: 500,
                                        }
                                        }
                                        plugins={[
                                        Autoplay({
                                            delay: 3000,
                                            stopOnInteraction: false,
                                            playOnInit: true
                                        }),
                                        ]}
                                    >
                                        <CarouselContent>
                                        {
                                            item.images.map((image, imgIndex) => (
                                            <CarouselItem key={imgIndex} className="w-full h-64">
                                                <img 
                                                    src={`/storage/public/${image.image_path}`} 
                                                    alt={`${item.name} ${imgIndex + 1}`} 
                                                    className="w-full h-full rounded-b-none rounded-lg object-cover" 
                                                />
                                            </CarouselItem>
                                            ))
                                        }
                                        </CarouselContent>
                                    </Carousel>
                                    <CardHeader className="p-4 mt-3">
                                        <h4 className="text-xl font-bold mb-2 text-red-500">{item.name}</h4>
                                        <h4 className="text-md font-semibold text-gray-500">Rp {numeral(item.price).format('0,0')}</h4>
                                        <Button 
                                            className="mt-4 bg-red-500 hover:bg-red-600 text-white w-full"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            Tambahkan Pesanan
                                        </Button>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="h-[80vh] w-[30%] bg-gray-50 mx-auto rounded-md border-gray-700 border p-4 flex flex-col overflow-y-auto gap-4">
                        <>
                            <div className='flex flex-col items-center mb-2 bg-red-500 border border-red-400 rounded-sm p-2'>
                                <h4 className='text-white font-semibold'>Harga belum termasuk pajak PB1 10%</h4>
                            </div>
                            {
                                props.existingTransaction ? (
                                    <>
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>Pesanan aktif</AccordionTrigger>
                                                <AccordionContent>
                                                    <div>
                                                        <div className="flex-1 overflow-y-auto">
                                                            <h3 className="font-semibold text-gray-700 mb-2 mt-2">Pesanan aktif :</h3>
                                                            {!props.existingTransaction ? (
                                                                <p className="text-gray-400">Belum ada pesanan aktif.</p>
                                                            ) : (
                                                                <ul className="space-y-2">
                                                                    {props.existingTransaction.details.map((item, idx) => (
                                                                        <li key={idx} className={
                                                                            `flex justify-between items-center ${idx === props.existingTransaction.details.length - 1 ? 'border-b-4' : 'border-b-2'} pb-1 gap-2`
                                                                        }>
                                                                            <div className="flex-1 text-sm">
                                                                                {item.quantity}x {item.menu.name}
                                                                            </div>
                                                                            <div className="text-sm font-medium">
                                                                                Rp {numeral(item.subtotal).format('0,0')}
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold text-gray-700">Total:</h3>
                                                        <h3 className="font-semibold text-gray-700">Rp {numeral(props.existingTransaction.subtotal_price).format('0,0')}</h3>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                        <div>
                                            {/* KERANJANG */}
                                            <div className="flex-1 overflow-y-auto">
                                                <h3 className="font-semibold text-gray-700 mb-2 mt-2">Keranjang Pesanan :</h3>
                                                {(props.existingTransaction ? existingItems : data.items).length === 0 ? (
                                                    <p className="text-gray-400">Belum ada pesanan.</p>
                                                ) : (
                                                    <ul className="space-y-2">
                                                        {(props.existingTransaction ? existingItems : data.items).map((item, idx) => {
                                                            return (
                                                                <li key={idx} className="flex justify-between items-center border-b pb-1 gap-2">
                                                                    <div className="flex-1 text-sm">
                                                                        {item.quantity}x {item.name}
                                                                        {/* {item.quantity}x {props.menus.find(menu => menu.id === item.menu_id)?.name || 'Menu tidak ditemukan'} */}
                                                                    </div>
                                                                    <div className="text-sm font-medium">
                                                                        Rp {numeral(item.price * item.quantity).format('0,0')}
                                                                    </div>
                                                                    <Button
                                                                        onClick={() => handleRemoveFromCart(item.menu_id)}
                                                                        variant="outline"
                                                                        type="button"
                                                                        className="text-red-500 border-red-500 hover:bg-red-100 px-2 py-0 text-xs"
                                                                    >
                                                                        <Trash className="w-4 h-4" />
                                                                    </Button>
                                                                </li>
                                                            )}
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                        {/* TOTAL */}
                                        <div className="pt-2">
                                            <p className="font-bold text-lg">Total: Rp {numeral(cartTotal).format('0,0')}</p>
                                            <Button
                                                className="mt-2 bg-green-600 hover:bg-green-700 text-white w-full"
                                                disabled={ existingItems.length === 0 }
                                                onClick={handleSubmit}
                                            >
                                                Konfirmasi Pesanan
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">Pilih Waktu Booking :</h3>
                                            <input
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                type="datetime-local"
                                                value={data.booking_start}
                                                min={new Date().toISOString().slice(0, 16)}
                                                onChange={(e) => setData('booking_start', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {
                                            data.booking_start && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-700 mb-2">Pilih Meja :</h3>
                                                    <div className="flex flex-wrap flex-row gap-2 justify-center">
                                                        {
                                                            tables.length > 0 ? (
                                                                tables.map((table, index) => {
                                                                    const isSelected = selectedTable === table.id
            
                                                                    return <Button
                                                                        key={index}
                                                                        className={`w-fit text-white transition-all
                                                                            ${!table.is_available
                                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                                            : isSelected
                                                                            ? 'bg-green-600 hover:bg-green-700'
                                                                            : 'bg-red-500 hover:bg-red-600'
                                                                        }`}
                                                                        onClick={() => handleTableSelect(table.id)}
                                                                    >
                                                                        {table.name}
                                                                    </Button>
                                                                })
                                                            ) : (
                                                                <p className="text-gray-500">Tidak ada meja ditemukan.</p>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div>
                                            {/* KERANJANG */}
                                            <div className="flex-1 overflow-y-auto">
                                                <h3 className="font-semibold text-gray-700 mb-2 mt-2">Keranjang Pesanan :</h3>
                                                {(props.existingTransaction ? existingItems : data.items).length === 0 ? (
                                                    <p className="text-gray-400">Belum ada pesanan.</p>
                                                ) : (
                                                    <ul className="space-y-2">
                                                        {(props.existingTransaction ? existingItems : data.items).map((item, idx) => (
                                                            <li key={idx} className="flex justify-between items-center border-b pb-1 gap-2">
                                                                <div className="flex-1 text-sm">
                                                                    {item.quantity}x {item.name}
                                                                    {/* {item.quantity}x {props.menus.find(menu => menu.id === item.menu_id)?.name || 'Menu tidak ditemukan'} */}
                                                                </div>
                                                                <div className="text-sm font-medium">
                                                                    Rp {numeral(item.price * item.quantity).format('0,0')}
                                                                </div>
                                                                <Button
                                                                    onClick={() => handleRemoveFromCart(item.menu_id)}
                                                                    variant="outline"
                                                                    className="text-red-500 border-red-500 hover:bg-red-100 px-2 py-0 text-xs"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                        {/* TOTAL */}
                                        <div className="border-t pt-2">
                                            <p className="font-bold text-lg">Total: Rp {numeral(cartTotal).format('0,0')}</p>
                                            <Button
                                                className="mt-2 bg-green-600 hover:bg-green-700 text-white w-full"
                                                disabled={processing || !data.table_id || data.items.length === 0}
                                                onClick={handleSubmit}
                                            >
                                                Konfirmasi Pesanan
                                            </Button>
                                        </div>
                                    </>
                                )
                            }
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index