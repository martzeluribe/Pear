import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer'; // Asegúrate de que la ruta sea correcta (mayúscula/minúscula)
import { Search, SquarePen, Trash2, Plus, Filter } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    mota: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    users: User[];
    filters: { search: string; field?: string };
}

// --- PALETA DE COLORES PARA LAS FILAS ---
const rowColors = [
    'bg-red-50 hover:bg-red-100 border-red-200',
    'bg-orange-50 hover:bg-orange-100 border-orange-200',
    'bg-amber-50 hover:bg-amber-100 border-amber-200',
    'bg-green-50 hover:bg-green-100 border-green-200',
    'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    'bg-teal-50 hover:bg-teal-100 border-teal-200',
    'bg-cyan-50 hover:bg-cyan-100 border-cyan-200',
    'bg-blue-50 hover:bg-blue-100 border-blue-200',
    'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    'bg-violet-50 hover:bg-violet-100 border-violet-200',
    'bg-purple-50 hover:bg-purple-100 border-purple-200',
    'bg-fuchsia-50 hover:bg-fuchsia-100 border-fuchsia-200',
    'bg-pink-50 hover:bg-pink-100 border-pink-200',
    'bg-rose-50 hover:bg-rose-100 border-rose-200',
];

const Erakutsi = ({ users, filters }: Props) => {
    const [search, setSearch] = useState(filters.search || '');
    const [field, setField] = useState(filters.field || 'name'); 

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/users', { search: search, field: field }, {
                preserveState: true,
                replace: true,
                preserveScroll: true 
            });
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search, field]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const filterOptions = [
        { id: 'name', label: 'Izena' },
        { id: 'email', label: 'Emaila' },
        { id: 'mota', label: 'Mota' },
        { id: 'id', label: 'ID' },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow bg-gray-100 p-8">
                <Head title="Erabiltzaileak" />
                
                <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                    
                    {/* CABECERA */}
                    <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center mb-6 gap-4">
                        <h2 className="text-3xl font-bold text-gray-800 w-full lg:w-auto flex items-center gap-2">
                             <span>👥</span> Erabiltzaileak
                        </h2>
                        
                        <div className="flex items-end gap-4 w-full lg:w-auto justify-end">
                            <div className="flex flex-col gap-2 items-end w-full lg:w-auto">
                                
                                {/* Botones de filtro */}
                                <div className="flex items-center gap-2 justify-end flex-wrap">
                                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                                        <Filter size={12}/> Bilatu:
                                    </span>
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setField(option.id)}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all border shadow-sm cursor-pointer outline-none ${
                                                field === option.id
                                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Input de búsqueda */}
                                <div className="relative w-full md:w-72">
                                    <input
                                        type="text"
                                        placeholder={`Bilatu ${field} bidez...`}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm text-sm bg-white text-gray-700"
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400">
                                        <Search size={18}/>
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.get('/users/create')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition-colors h-10 mb-[1px]"
                            >
                                <Plus size={20} /> 
                                <span className="hidden sm:inline">Gehitu</span>
                            </button>
                        </div>
                    </div>

                    {/* Cabecera de columnas */}
                    <div className="hidden lg:flex items-center gap-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mr-2 border-b border-gray-200 mb-2">
                        <span className="w-12">ID</span>
                        <span className="flex-1">Izena</span>
                        <span className="flex-1">Emaila</span>
                        <span className="w-32">Mota</span>
                        <span className="w-24 text-center">Sortua</span>
                        <span className="w-24 text-center">Eguneratua</span>
                        <span className="w-64 text-right">Ekintzak</span>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {users.length > 0 ? (
                            users.map((u, index) => {
                                // Seleccionamos el color basado en el índice
                                const rowColor = rowColors[index % rowColors.length];

                                return (
                                    <div 
                                        key={u.id} 
                                        className={`${rowColor} transition-transform hover:-translate-y-0.5 flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl shadow-sm border`}
                                    >
                                        <div className="flex-1 grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-8 text-sm text-gray-800">
                                            <span className="font-bold lg:font-normal lg:w-12 text-gray-500">#{u.id}</span>
                                            
                                            <span className="font-bold text-base lg:text-sm lg:font-medium lg:flex-1">
                                                {u.name}
                                            </span>
                                            
                                            <span className="italic lg:flex-1 text-gray-600 truncate">
                                                {u.email}
                                            </span>
                                            
                                            <span className="lg:w-32">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm ${u.mota === 'admin' ? 'bg-purple-200 text-purple-800 border-purple-300' : 'bg-blue-200 text-blue-800 border-blue-300'}`}>
                                                    {u.mota === 'admin' ? 'Administratzailea' : 'Erabiltzailea'}
                                                </span>
                                            </span>
                                            
                                            <span className="text-xs text-gray-500 lg:w-24 lg:text-center" title="Sortze data">
                                                {formatDate(u.created_at)}
                                            </span>
                                            
                                            <span className="text-xs text-gray-400 lg:w-24 lg:text-center" title="Azken eguneraketa">
                                                {formatDate(u.updated_at)}
                                            </span>
                                        </div>

                                        <div className="flex gap-3 justify-end lg:w-64 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-300/50">
                                            <button
                                                onClick={() => router.get(`/users/${u.id}/edit`)}
                                                className="flex items-center gap-2 bg-white hover:bg-yellow-50 text-yellow-600 border border-yellow-600 hover:border-yellow-500 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition"
                                            >
                                                <SquarePen size={16} /> Editatu
                                            </button>
                                            <button
                                                onClick={() => confirm('Ziur zaude ezabatu nahi duzula?') && router.delete(`/users/${u.id}`)}
                                                className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-600 hover:border-red-500 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition"
                                            >
                                                <Trash2 size={16} /> Ezabatu
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">
                                    {search ? `Ez da emaitzarik aurkitu "${field}" eremuan.` : 'Ez da erabiltzailerik aurkitu.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Erakutsi;