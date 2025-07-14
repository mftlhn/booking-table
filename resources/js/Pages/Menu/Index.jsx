import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table'
import { Button } from '@/shadcn/ui/button'
import { ChevronLeft, ChevronRight, Edit, Image, LucideCheck, LucideMoon, LucidePlusSquare, LucideSun, LucideX, Trash } from 'lucide-react'
import AddMenu from '@/Components/Menu/AddMenu'
import Select from 'react-select'
import { Input } from '@/shadcn/ui/input'
import { useSearch } from '@/hooks/useSearch'
import { usePagination } from '@/hooks/usePagination'
import numeral from 'numeral'
import EditMenu from '@/Components/Menu/EditMenu'
import Activate from '@/Components/Menu/Activate'

const category = [
    { value: 'appetizer', label: 'Makanan Pembuka' },
    { value: 'main_course', label: 'Makanan Utama' },
    { value: 'dessert', label: 'Makanan Penutup' },
    { value: 'beverage', label: 'Minuman' },
]

const Index = ({ ...props }) => {
    const { search, setSearch, filteredData } = useSearch(props.menus, ['name', 'category']);
    const { page, limit, maxPage, paginatedData, handlePageChange, handleLimitChange } = usePagination(filteredData);  

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Menu
                </h2>
            }
            appName={props.appName}
        >
            <Head title="Menu" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col-reverse lg:flex-row p-4 gap-2 lg:gap-0 justify-between mb-4">
                            <div className="flex flex-col gap-2 lg:flex-row items-end space-x-4">
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="lg:w-64 w-full"
                                    placeholder="Search . . ."
                                />
                                <Select
                                    options={
                                        [
                                            { value: 10, label: '10' },
                                            { value: 25, label: '25' },
                                            { value: 50, label: '50' },
                                        ]
                                    }
                                    isSearchable={false}
                                    defaultValue={{ value: 10, label: '10' }}
                                    onChange={(e) => handleLimitChange(e.value)}
                                    className="w-24"
                                />
                            </div>
                            <div className='flex flex-col items-end'>
                                <AddMenu />
                            </div>
                        </div>
                        <Table className="border rounded-lg">
                            <TableCaption>List Menu.</TableCaption>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="w-[75px] text-center">#</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    paginatedData.map((menu, index) => (
                                        <TableRow key={menu.id}>
                                            <TableCell className="text-center">{(page - 1) * limit + index + 1}</TableCell>
                                            <TableCell>{menu.name}</TableCell>
                                            <TableCell>{category.find((opt) => opt.value === menu.category).label}</TableCell>
                                            <TableCell>Rp {numeral(menu.price).format('0,0')}</TableCell>
                                            <TableCell>{menu.description.length > 50 ? menu.description.slice(0, 50) + ' . . .' : menu.description}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${menu.is_active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {menu.is_active === 1 ? 'Tersedia' : 'Tidak Tersedia'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <EditMenu menu={menu} />
                                                <Activate menu={menu} />
                                            </TableCell>
                                        </TableRow>
                                    ))
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