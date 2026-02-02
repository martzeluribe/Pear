import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer'; // Asegúrate que tu archivo se llame Footer.tsx (Mayúscula)
import { Search, Trash2, Plus, SquarePen, Hash, Calendar, User, Clock, Filter } from 'lucide-react';

// Interfaces
interface Filters {
    search?: string;
    type?: string; 
}

interface PisuaLocal {
    id: number;
    izena: string;
    kodigoa: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    pisuak: PisuaLocal[];
    filters?: Filters; // Hacemos esto opcional para evitar errores
}

export default function Erakutsi({ pisuak = [], filters = {} }: Props) {
    
    // SEGURIDAD: Usamos 'filters?.search' y valores por defecto por si filters viene vacío
    const [search, setSearch] = useState(filters?.search || '');
    const [searchType, setSearchType] = useState(filters?.type || 'izena');
    
    const isMounted = useRef(false);

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('eu-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Efecto para la búsqueda automática (Debounce)
    useEffect(() => {
        if (isMounted.current) {
            const delayDebounceFn = setTimeout(() => {
                router.get(
                    '/pisua', // Asegúrate de que esta ruta en web.php apunte a este controlador
                    { 
                        search: search,
                        type: searchType
                    },
                    { 
                        preserveState: true,
                        replace: true,
                        preserveScroll: true
                    }
                );
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            isMounted.current = true;
        }
    }, [search, searchType]);

    const ezabatuPisua = (id: number, izena: string) => {
        if (window.confirm(`Ziur zaude "${izena}" pisua ezabatu nahi duzula?`)) {
            router.delete(`/pisua/${id}`);
        }
    };

    const filterOptions = [
        { id: 'izena', label: 'Izena' },
        { id: 'kodigoa', label: 'Kodea' },
        { id: 'user_id', label: 'User ID' },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            
            <main className="flex-grow bg-gray-100 p-8">
                <Head title="Pisuen Zerrenda" />
                
                <div className="max-w-7xl mx-auto bg-gray-200 shadow-sm rounded-xl p-6 border border-gray-300">
                    
                    {/* CABECERA */}
                    <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center mb-6 gap-4">
                        
                        <h2 className="text-3xl font-bold text-gray-800 w-full lg:w-auto">Pisuak</h2>
                        
                        <div className="flex items-end gap-4 w-full lg:w-auto justify-end">
                            <div className="flex flex-col gap-2 items-end w-full lg:w-auto">
                                <div className="flex items-center gap-2 justify-end flex-wrap">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                        <Filter size={12}/> Bilatu:
                                    </span>
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSearchType(option.id)}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all border shadow-sm cursor-pointer outline-none ${
                                                searchType === option.id
                                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                                    : 'bg-white text-gray-700 border-none hover:bg-gray-50'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative w-full md:w-72">
                                    <input
                                        type="text"
                                        placeholder={`Bilatu ${searchType} bidez...`}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2 rounded-lg border-none focus:ring-2 focus:ring-indigo-400 shadow-inner text-sm bg-white text-gray-700"
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400">
                                        <Search size={18} />
                                    </span>
                                </div>
                            </div>

                            <Link 
                                href="/pisua/sortu" // Asegúrate de que esta URL coincida con tu web.php
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition-colors h-10 mb-[1px]" 
                            >
                                <Plus size={20} />
                                <span className="hidden sm:inline">Gehitu</span>
                            </Link>
                        </div>
                    </div>

                    {/* LISTADO DE PISOS */}
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* SEGURIDAD: Verificamos pisuak?.length por si es undefined */}
                        {pisuak?.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                {search ? `Ez da emaitzarik aurkitu "${searchType}" eremuan.` : 'Ez dago pisurik.'}
                            </div>
                        ) : (
                            // SEGURIDAD: Usamos el operador ?. por si acaso
                            pisuak?.map((pisua) => (
                                <div 
                                    key={pisua.id} 
                                    className="bg-white/70 hover:bg-white transition flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-5 rounded-xl shadow-sm border border-gray-200"
                                >
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-2 mb-4">
                                            {/* AÑADIDO: max-w-2xl, truncate y block para limitar la anchura del nombre */}
                                            <span className="text-xl font-medium text-gray-800 max-w-2xl truncate block" title={pisua.izena}>{pisua.izena}</span>
                                        </div>

                                        {/* AÑADIDO: max-w-4xl para limitar la anchura de los datos */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-base text-gray-600 max-w-4xl">
                                            <div className="flex items-center gap-3">
                                                <Hash size={20} className="text-gray-400" />
                                                <div>
                                                    <span className="font-semibold text-gray-700">Kodea:</span> {pisua.kodigoa}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <User size={20} className="text-gray-400" />
                                                <div>
                                                    <span className="font-semibold text-gray-700">Erabiltzailea (ID):</span> {pisua.user_id}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Calendar size={20} className="text-gray-400" />
                                                <div>
                                                    <span className="font-semibold text-gray-700">Sortua:</span> {formatDate(pisua.created_at)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={20} className="text-gray-400" />
                                                <div>
                                                    <span className="font-semibold text-gray-700">Eguneratua:</span> {formatDate(pisua.updated_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full lg:w-auto justify-end mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                                        <Link 
                                            href={`/pisua/${pisua.id}/edit`} 
                                            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow transition border border-yellow-500"
                                        >
                                            <SquarePen size={18} />
                                            Editatu
                                        </Link>
                                        
                                        <button 
                                            onClick={() => ezabatuPisua(pisua.id, pisua.izena)}
                                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition"
                                        >
                                            <Trash2 size={18} />
                                            Ezabatu
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            
            <Footer/>
        </div>
    );
}