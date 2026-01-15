import React from 'react';
import { Link, usePage } from '@inertiajs/react'; // Importamos usePage
import { LogIn, House, User, LogOut } from 'lucide-react';

export default function Header() {
    // Extraemos 'auth' de las props globales de Inertia
    const { auth } = usePage().props;

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-[#2D447E] text-white shadow-md">
            
            {/* Logo y Contenedor Izquierdo */}
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="pl-5">
                        <House size={25} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Pisukideak</span>
                </Link>

                {/* LINKS CONDICIONALES (Solo si está logeado) */}
                {auth.user && (
                    <div className="flex items-center gap-4 text-sm font-medium border-l border-blue-400 pl-6">
                        <Link href="/hasiera" className="hover:text-blue-200">Hasiera</Link>
                        <span className="opacity-50">|</span>
                        <Link href="/pisuak" className="hover:text-blue-200">Pisuak</Link>
                        <span className="opacity-50">|</span>
                        <Link href="/ezarpenak" className="hover:text-blue-200">Ezarpenak</Link>
                    </div>
                )}
            </div>

            {/* Parte Derecha: Usuario o Login */}
            <div>
                {auth.user ? (
                    <div className="flex items-center gap-6">
                        <Link 
                            href="settings/profile" // Usamos el nombre de la ruta de Laravel
                            className="flex items-center gap-2 hover:text-blue-200 transition-colors group"
                        >
                            <User size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="font-semibold">{auth.user.name}</span>
                        </Link>
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="flex items-center gap-2 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Saioa Itxi</span>
                        </Link>
                    </div>
                ) : (
                    <Link 
                        href="/login" 
                        className="flex items-center gap-2 text-sm font-bold hover:text-blue-200 transition-colors tracking-wide"
                    >
                        <span>HASI SAIOA</span>
                        <LogIn size={20} />
                    </Link>
                )}
            </div>
        </nav>
    );
}