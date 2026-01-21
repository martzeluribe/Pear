import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/components/footer';
import { Search, SquarePen, Trash2, Plus } from 'lucide-react';

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

const Erakutsi = ({ users, filters }: Props) => {
    const [search, setSearch] = useState(filters.search || '');
    const [field, setField] = useState(filters.field || 'dena');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/users', { search: search, field: field }, {
                preserveState: true,
                replace: true
            });
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search, field]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow bg-gray-100 p-8">
                <Head title="Erabiltzaileak" />
                
                <div className="max-w-7xl mx-auto bg-gray-200 shadow-sm rounded-xl p-6 border border-gray-300">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-700">Erabiltzaileak</h1>
                        
                        <div className="flex gap-4">
                            <div className="flex gap-2">
                                <select
                                    value={field}
                                    onChange={(e) => setField(e.target.value)}
                                    className="rounded-lg border-none focus:ring-2 focus:ring-indigo-400 shadow-inner text-sm py-2 px-3 bg-white text-gray-700 cursor-pointer outline-none"
                                >
                                    <option value="dena">Dena</option>
                                    <option value="id">ID</option>
                                    <option value="name">Izena</option>
                                    <option value="email">Mail</option>
                                    <option value="mota">Mota</option>
                                    <option value="created_at">Sortua</option>
                                    <option value="updated_at">Eguneratua</option>
                                </select>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Bilatu..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-4 pr-10 py-2 rounded-lg border-none focus:ring-2 focus:ring-indigo-400 w-48 shadow-inner text-sm"
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400">
                                        <Search size={18}/>
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.get('/users/create')}
                                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition shadow-md"
                            >
                                <Plus size={20} /> Gehitu
                            </button>
                        </div>
                    </div>

                    {/* Cabecera de columnas: La dejamos FUERA del scroll para que siempre se vea */}
                    <div className="hidden lg:flex items-center gap-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
                        <span className="w-12">ID</span>
                        <span className="flex-1">Izena</span>
                        <span className="flex-1">Emaila</span>
                        <span className="w-32">Mota</span>
                        <span className="w-24 text-center">Sortua</span>
                        <span className="w-24 text-center">Eguneratua</span>
                        <span className="w-64 text-right">Ekintzak</span>
                    </div>

                    {/* CAMBIOS AQUÍ:
                        1. max-h-[500px]: Altura máxima aproximada para 6 filas (ajusta este número si hace falta).
                        2. overflow-y-auto: Habilita el scroll vertical si pasa de 500px.
                        3. pr-2: Un poco de padding a la derecha para que el texto no toque la barra de scroll.
                    */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {users.length > 0 ? (
                            users.map(u => (
                                <div key={u.id} className="bg-white/70 hover:bg-white transition flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl shadow-sm border border-gray-200">
                                    <div className="flex-1 grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-8 text-sm text-gray-800">
                                        <span className="font-bold lg:font-normal lg:w-12 text-indigo-600">{u.id}</span>
                                        <span className="font-medium lg:flex-1">{u.name}</span>
                                        <span className="italic lg:flex-1 text-gray-600">{u.email}</span>
                                        <span className="lg:w-32">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.mota === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
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

                                    <div className="flex gap-3 justify-end lg:w-64">
                                        <button
                                            onClick={() => router.get(`/users/${u.id}/edit`)}
                                            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-bold text-xs shadow transition border border-yellow-500"
                                        >
                                            <SquarePen size={16} /> Editatu
                                        </button>
                                        <button
                                            onClick={() => confirm('Ziur zaude ezabatu nahi duzula?') && router.delete(`/users/${u.id}`)}
                                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow transition"
                                        >
                                            <Trash2 size={16} /> Ezabatu
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">Ez da erabiltzailerik aurkitu.</div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Erakutsi;