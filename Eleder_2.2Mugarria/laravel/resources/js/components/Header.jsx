import React, { useState } from 'react';
import { dashboard, login, register } from '@/routes';
import { Link, usePage } from '@inertiajs/react'; 
import { LogIn, House, User, LogOut, Menu, X } from 'lucide-react';

export default function Header() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="relative text-white shadow-md w-full z-50" style={{ backgroundColor: '#1e3a8a' }}>
            {/* Contenedor principal: justify-between mantiene todo en las esquinas */}
            <div className="flex justify-between items-center px-8 py-4">
                
                {/* Logo y Contenedor Izquierdo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div className="pl-5">
                            <House size={25} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Pisukideak</span>
                    </Link>

                    {/* LINKS CONDICIONALES (Escritorio) */}
                    {auth.user && (
                        <div className="hidden lg:flex items-center gap-4 text-sm font-medium border-l-2 border-white pl-6 py-1">
                            <Link href="/" className="hover:text-blue-200">Hasiera</Link>
                            
                            <span className="h-6 border-l border-white opacity-100"></span>
                            
                            <Link href={dashboard()} className="hover:text-blue-200">Laburpena</Link>
                            
                            <span className="h-6 border-l border-white opacity-100"></span>
                            
                            <Link href="/nirepisuak" className="hover:text-blue-200">Pisuak</Link>
                            
                            <span className="h-6 border-l border-white opacity-100"></span>
                            
                            <Link href="/users" className="hover:text-blue-200">Erabiltzaileak CRUD</Link>

                            <span className="h-6 border-l border-white opacity-100"></span>
                            
                            <Link href="/pisua" className="hover:text-blue-200">Pisuak CRUD</Link>
                        </div>
                    )}
                </div>

                {/* Parte Derecha: Usuario o Login */}
                <div className="flex items-center">
                    {/* Botones Escritorio */}
                    <div className="hidden lg:block">
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

                    {/* Botón Menú Móvil */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="lg:hidden p-2 rounded-md hover:bg-blue-800 transition-colors"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Menú Desplegable Móvil */}
            {isOpen && (
                <div className="lg:hidden bg-[#1e3a8a] border-t border-blue-700 px-8 py-4 space-y-4 shadow-xl">
                    {auth.user ? (
                        <>
                            <div className="flex flex-col gap-3">
                                <Link href="/" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Hasiera</Link>
                                <Link href={dashboard()} className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Laburpena</Link>
                                <Link href="/nirepisuak" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Pisuak</Link>
                                <Link href="/users" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Erabiltzaileak CRUD</Link>
                                <Link href="/pisua" className="hover:text-blue-200" onClick={() => setIsOpen(false)}>Pisuak CRUD</Link>
                            </div>
                            <div className="pt-4 border-t border-blue-700 flex justify-between items-center">
                                <Link href="settings/profile" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <User size={18} />
                                    <span className="font-semibold">{auth.user.name}</span>
                                </Link>
                                <Link href="/logout" method="post" as="button" className="flex items-center gap-2 text-red-300">
                                    <LogOut size={18} />
                                    <span>Saioa Itxi</span>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="flex items-center justify-center gap-2 font-bold py-2" onClick={() => setIsOpen(false)}>
                            <span>HASI SAIOA</span>
                            <LogIn size={20} />
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}