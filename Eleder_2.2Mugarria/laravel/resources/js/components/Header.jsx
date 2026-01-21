import React from 'react';
import { dashboard, login, register } from '@/routes';
import { Link, usePage } from '@inertiajs/react'; 
import { LogIn, House, User, LogOut } from 'lucide-react';

export default function Header() {
    const { auth } = usePage().props;

    return (
        <nav className="flex justify-between items-center px-8 py-4 text-white shadow-md" style={{ backgroundColor: '#1e3a8a' }}>
            
            {/* Logo y Contenedor Izquierdo */}
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="pl-5">
                        <House size={25} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Pisukideak</span>
                </Link>

                {/* LINKS CONDICIONALES */}
                {auth.user && (
                    <div className="flex items-center gap-4 text-sm font-medium border-l-2 border-white pl-6 py-1">
                        <Link href="/" className="hover:text-blue-200">Welcome</Link>
                        
                        <span className="h-6 border-l border-white opacity-100"></span>
                        
                        <Link href={dashboard()} className="hover:text-blue-200">Dashboard</Link>
                        
                        <span className="h-6 border-l border-white opacity-100"></span>
                        
                        <Link href="/pisuak" className="hover:text-blue-200">Pisuak</Link>
                        
                        <span className="h-6 border-l border-white opacity-100"></span>
                        
                        <Link href="/users" className="hover:text-blue-200">Erabiltzaileak CRUD</Link>

                        <span className="h-6 border-l border-white opacity-100"></span>
                        
                        <Link href="/pisua" className="hover:text-blue-200">Pisuen CRUD-a (Admin)</Link>

                    </div>
                )}
            </div>

            {/* Parte Derecha: Usuario o Login */}
            <div>
                {auth.user ? (
                    <div className="flex items-center gap-6">
                        <Link 
                            href="settings/profile" 
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