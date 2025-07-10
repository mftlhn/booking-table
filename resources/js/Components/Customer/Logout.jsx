import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from '@/shadcn/ui/alert-dialog'
import { Button } from '@/shadcn/ui/button'
import { router } from '@inertiajs/react'
import React from 'react'

const Logout = () => {
    const handleLogout = () => {
        router.post('/logout') // atau ganti sesuai route logout kamu
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button className="text-white hover:underline hover:bg-transparent bg-transparent p-0 m-0 border-none outline-none">
                    Keluar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Jika anda ingin melihat transaksi, anda harus login kembali.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Logout