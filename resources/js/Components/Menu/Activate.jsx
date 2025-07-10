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
import { useForm } from '@inertiajs/react'
import { LucideCheck, LucideX } from 'lucide-react'
import React from 'react'

const Activate = ({ menu }) => {
    const { data, setData, post } = useForm({
        id: menu.id
    })
    const handleSubmit = () => {
        post(route('menus.toggle'), {
            onSuccess: () => {
                // Optionally, you can show a success message or perform other actions
            },
            onError: (errors) => {
                // Handle errors if needed
                console.error(errors);
            }
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={menu.is_active === 1 ? 'destructive' : 'outline'} size="sm">
                    {
                        menu.is_active === 1 ? (
                            <LucideX className="w-4 h-4" />
                        ) : (
                            <LucideCheck className="w-4 h-4" />
                        )
                    }
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah kamu yakin ingin {menu.is_active === 1 ? 'menonaktifkan' : 'mengaktifkan'} menu ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Dengan melakukan ini, menu akan {menu.is_active === 1 ? 'menonaktifkan' : 'mengaktifkan'} menu {menu.name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Activate