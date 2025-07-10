import { usePage } from '@inertiajs/react'
import React from 'react'
import Logout from './Logout';

const Header = ({ auth }) => {
    const url = usePage().url.split('/')[1];    

    return (
        <header className="bg-red-500 text-white py-6 shadow-md">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                {/* <h1 className="text-3xl font-bold">Warung Nusantara</h1> */}
                <a href="/" className="text-3xl font-bold text-white hover:text-gray-200 transition-colors">
                    Warung Nusantara
                </a>
                <nav className="space-x-4 text-center">
                    {
                        url !== 'cart' ? (
                            <>
                                <a href="#menu" className="hover:underline block md:inline">Menu</a>
                                <a href="#location" className="hover:underline block md:inline">Lokasi</a>
                                <a href="#contact" className="hover:underline block md:inline">Kontak</a>
                            </>
                        ) : null
                    }
                    {
                        auth.user ? (
                            <>
                                <a href="/cart" className="hover:underline block md:inline">Pesanan</a>
                                <Logout />
                            </>
                        ) : (
                            <a href="/login" className="hover:underline block md:inline">Masuk/Daftar</a>
                        )
                    }
                </nav>
            </div>
        </header>
    )
}

export default Header