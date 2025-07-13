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
                <a href="#" className="text-white hover:underline">
                    Keluar
                </a>
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