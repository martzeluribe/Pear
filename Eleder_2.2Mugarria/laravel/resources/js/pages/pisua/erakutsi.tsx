import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';
import { Search, Trash2, Plus, Pencil, Hash, Calendar, User, Clock, Filter } from 'lucide-react';

interface Filters {
    search?: string;
    type?: string; // Recibimos el tipo de filtro actual
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
    filters: Filters;
}

export default function Erakutsi({ pisuak, filters }: Props) {
    
    const [search, setSearch] = useState(filters.search || '');
    const [searchType, setSearchType] = useState(filters.type || 'izena');
    
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

    useEffect(() => {
        if (isMounted.current) {
            const delayDebounceFn = setTimeout(() => {
                router.get(
                    '/pisua',
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
        <>
            <Header/>
            
            <div className="bg-white p-8">
                <Head title="Pisuen Zerrenda" />
                
                <div className="max-w-5xl mx-auto">
                    
                    <div className="flex justify-end mb-4">
                         <Link 
                            href={"/pisua/sortu"} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Sortu Pisua
                        </Link>
                    </div>

                    <div className="bg-gray-200 rounded-xl p-6 max-h-[500px] overflow-y-auto mb-6">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-semibold text-gray-700">Pisuak</h2>
                            
                            {/* Buscador con filtros */}
                            <div className="flex flex-col w-full md:w-auto gap-2">
                                
                                {/* Botones de filtro */}
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                        <Filter size={12}/> Bilatu hemen:
                                    </span>
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setSearchType(option.id)}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${
                                                searchType === option.id
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Buscador */}
                                <div className="relative w-full md:w-72">
                                    <input
                                        type="text"
                                        placeholder={`Bilatu ${searchType} bidez...`}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                                    />
                                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {pisuak.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    {search ? `Ez da emaitzarik aurkitu "${searchType}" eremuan.` : 'Ez dago pisurik.'}
                                </div>
                            ) : (
                                pisuak.map((pisua) => (
                                    <div 
                                        key={pisua.id} 
                                        className="bg-gray-300/80 rounded-lg p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-sm hover:shadow-md transition-shadow gap-4"
                                    >
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xl font-bold text-gray-800">{pisua.izena}</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Hash size={16} className="text-gray-500" />
                                                    <span className="font-semibold">Kodea:</span> {pisua.kodigoa}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-500" />
                                                    <span className="font-semibold">Erabiltzailea (ID):</span> {pisua.user_id}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-gray-500" />
                                                    <span className="font-semibold">Sortua:</span> {formatDate(pisua.created_at)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-gray-500" />
                                                    <span className="font-semibold">Eguneratua:</span> {formatDate(pisua.updated_at)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full lg:w-auto justify-end mt-2 lg:mt-0 border-t lg:border-t-0 border-gray-400/30 pt-3 lg:pt-0">
                                            <Link 
                                                href={`/pisua/${pisua.id}/edit`} 
                                                className="bg-yellow-300 hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors flex items-center gap-2"
                                            >
                                                <Pencil size={16} />
                                                Editatu
                                            </Link>
                                            
                                            <button 
                                                onClick={() => ezabatuPisua(pisua.id, pisua.izena)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded shadow-sm text-sm flex items-center gap-2 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                Ezabatu
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer/>
        </>
    );
}
