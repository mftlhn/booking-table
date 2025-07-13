import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table'
import { Button } from '@/shadcn/ui/button'
import { ChevronLeft, ChevronRight, Edit, Image, LucidePlusSquare, Trash } from 'lucide-react'
import Select from 'react-select'
import { Input } from '@/shadcn/ui/input'
import { useSearch } from '@/hooks/useSearch'
import { usePagination } from '@/hooks/usePagination'
import AddTable from '@/Components/Table/AddTable'

const Index = ({ ...props }) => {
    const { search, setSearch, filteredData } = useSearch(props.tables, ['name']);
    const { page, limit, maxPage, paginatedData, handlePageChange, handleLimitChange } = usePagination(filteredData);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Table
                </h2>
            }
        >
            <Head title="Table" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* <div className="flex justify-end p-6 text-gray-900">
                            <AddMenu />
                        </div> */}
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
                                {/* <AddMenu /> */}
                                <AddTable />
                            </div>
                        </div>
                        <Table className="border rounded-lg">
                            <TableCaption>List User</TableCaption>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="w-[75px] text-center">#</TableHead>
                                    <TableHead className="text-center">Nama</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    paginatedData.map((menu, index) => (
                                        <TableRow key={menu.id}>
                                            <TableCell className="text-center">{(page - 1) * limit + index + 1}</TableCell>
                                            <TableCell className="text-center">{menu.name}</TableCell>
                                            <TableCell className="text-center">
                                                {/* <EditMenu menu={menu} /> */}
                                                {/* <Button variant="destructive" size="sm">
                                                    <Trash className="w-4 h-4" />
                                                </Button> */}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
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