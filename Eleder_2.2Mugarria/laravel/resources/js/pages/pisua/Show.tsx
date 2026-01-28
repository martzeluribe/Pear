import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';
import { Edit, Trash2, UserPlus, PenLine, X } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Pisua {
    id: number;
    izena: string;
    deskripzioa?: string;
    helbidea?: string;
    kodigoa: string;
    imagen_path?: string;
    users?: User[];
    user_id: number; // Asegúrate de que esto coincide con tu BBDD
}

// 1. AÑADIMOS isAdmin AQUÍ
interface ShowProps {
    pisua: Pisua;
    isAdmin: boolean; 
}

export default function Show({ pisua, isAdmin }: ShowProps) { // <--- RECIBIMOS isAdmin
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const submitAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pisua/${pisua.id}/add-member`, {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const bgImage = pisua.imagen_path 
        ? `/storage/${pisua.imagen_path}` 
        : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"; 

    const getCardColor = (index: number) => {
        const colors = ['bg-pink-400', 'bg-yellow-300', 'bg-orange-400'];
        return colors[index % colors.length];
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />
            <Head title={pisua.izena} />

            <main className="flex-grow bg-white">
                
                {/* HERO */}
                <div className="relative h-64 w-full">
                    <img src={bgImage} alt={pisua.izena} className="w-full h-full object-cover brightness-75"/>
                    <div className="absolute bottom-0 left-0 p-8 text-white w-full bg-gradient-to-t from-black/60 to-transparent">
                        <h1 className="text-4xl font-bold uppercase tracking-wider">{pisua.izena}</h1>
                        <p className="text-lg opacity-90">{pisua.helbidea || 'Helbidea zehaztu gabe'}</p>
                    </div>
                </div>

                {/* NAV */}
                <div className="bg-gray-300 py-3 px-8 flex gap-8 text-gray-800 font-semibold border-b border-gray-400 shadow-inner">
                    <button className="hover:text-blue-700 transition">Informazioa</button>
                    <button className="hover:text-blue-700 transition">Zereginak</button>
                    <button className="hover:text-blue-700 transition">Gastuak</button>
                </div>

                {/* MAIN CONTENT */}
                <div className="bg-emerald-100/50 p-8 relative min-h-[500px]">
                    
                    {/* 2. PROTEGEMOS EL BOTÓN EDITAR (Solo Admin) */}
                    {isAdmin && (
                        <div className="absolute top-6 right-8">
                            <Link 
                                href={`/pisua/${pisua.id}/edit`}
                                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                            >
                                <PenLine size={18} />
                                Editatu informazioa
                            </Link>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto space-y-8">
                        
                        {/* DESCRIPCIÓN */}
                        <div className="bg-emerald-100/80 border border-emerald-200 p-6 rounded-lg shadow-sm max-w-3xl">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Deskripzioa</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {pisua.deskripzioa || "Ez dago deskripziorik."}
                            </p>
                        </div>

                        {/* SECCIÓN PISUKIDEAK */}
                        <div>
                            {/* 3. PROTEGEMOS EL BOTÓN AÑADIR (Solo Admin) */}
                            {isAdmin && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md mb-6 font-medium transition"
                                >
                                    <UserPlus size={20} />
                                    Gehitu pisukidea
                                </button>
                            )}

                            {/* Lista de Usuarios */}
                            <div className="flex flex-wrap gap-6">
                                {pisua.users && pisua.users.length > 0 ? (
                                    pisua.users.map((user, index) => (
                                        <div 
                                            key={user.id} 
                                            className={`${getCardColor(index)} w-48 p-4 rounded-xl shadow-md flex flex-col items-center gap-3`}
                                        >
                                            <span className="font-bold text-gray-900 text-lg text-center">{user.name}</span>
                                            
                                            {/* Opcional: También podrías proteger estos botones de editar/borrar usuario individual */}
                                            {isAdmin && (
                                                <div className="flex gap-3 mt-2">
                                                    <button className="bg-white/50 p-2 rounded border border-black/20 hover:bg-white/80 transition"><Edit size={18}/></button>
                                                    <button className="bg-red-600 text-white p-2 rounded border border-black/20 hover:bg-red-700 transition"><Trash2 size={18}/></button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">Oraindik ez dago inor pisu honetan.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RESUMEN INFERIOR (Igual que antes...) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-white">
                    <div className="bg-slate-300 p-8 h-48 flex flex-col justify-center items-center border-r border-slate-400">
                        <h3 className="text-2xl text-gray-800 font-semibold mb-2">Zereginak</h3>
                        <span className="text-4xl font-bold text-gray-900">1</span>
                        <span className="text-gray-600">0 zain</span>
                    </div>
                    <div className="bg-slate-300 p-8 h-48 flex flex-col justify-center items-center">
                        <h3 className="text-2xl text-gray-800 font-semibold mb-2">Gastuak</h3>
                        <span className="text-4xl font-bold text-gray-900">0,00€</span>
                    </div>
                </div>

            </main>

            {/* MODAL (Solo se renderiza si isAdmin es true y el modal está abierto, 
                pero como el botón para abrirlo está oculto, esto es seguro visualmente) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                   {/* ... (Todo el código del modal igual que antes) ... */}
                   <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Gehitu erabiltzailea</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={submitAddMember} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Emaila</label>
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="laguna@email.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    autoFocus
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-bold transition">Utzi</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition shadow-md">{processing ? 'Gehitzen...' : 'Gehitu'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}