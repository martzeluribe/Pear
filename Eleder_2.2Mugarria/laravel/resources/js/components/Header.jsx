import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, LogIn, House } from 'lucide-react';

export default function Header() {
    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-[#2D447E] text-white shadow-md">
            {/* Logo y Nombre */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="pl-5  ">
                    <House size={25} strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-bold tracking-tight">Pisukideak</span>
            </Link>

            {/* Botón Acceso */}
            <div>
                <Link 
                    href="/login" 
                    className="flex items-center gap-2 text-sm font-bold hover:text-blue-200 transition-colors tracking-wide"
                >
                    <span>HASI SAIOA</span>
                    <LogIn size={20} />
                </Link>
            </div>
        </nav>
    );
}