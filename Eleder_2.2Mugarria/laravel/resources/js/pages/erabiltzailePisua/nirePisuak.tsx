import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/Components/Footer';
import { ArrowRightCircle, Plus, MapPin } from 'lucide-react';

// --- INTERFACES ---
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
    imagen_path?: string;
    kodigoa: string;
    user_id: number;
    rol_actual?: 'admin' | 'kide';
    users: User[];
}

interface Props {
    pisuak: Pisua[];
}

// --- PALETA DE COLORES PARA LOS MIEMBROS (Burbujitas pequeñas) ---
const memberColors = [
    'bg-pink-300 text-pink-900',
    'bg-yellow-300 text-yellow-900',
    'bg-orange-300 text-orange-900',
    'bg-blue-300 text-blue-900',
    'bg-green-300 text-green-900',
    'bg-purple-300 text-purple-900',
];

// --- NUEVA: PALETA DE COLORES PARA LAS TARJETAS DE PISO ---
const cardBackgroundColors = [
    'bg-emerald-100', // Verde suave (el original)
    'bg-amber-100',   // Ámbar suave (el original)
    'bg-blue-100',    // Azul suave
    'bg-rose-100',    // Rosa suave
    'bg-indigo-100',  // Índigo suave
    'bg-teal-100',    // Verde azulado suave
];


export default function NirePisuak({ pisuak }: Props) {
    
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <Head title="Nire Pisuak" />
                
                <div className="max-w-6xl mx-auto">
                    
                    {/* ENCABEZADO Y BOTÓN 'SORTU' */}
                    <div className="flex justify-between items-center mb-8 border-b-2 border-red-500 pb-4">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                            <span className="text-4xl">👥</span> Pisuak
                        </h2>
                        
                        <Link 
                            href={"/pisua/sortu"} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Sortu Pisua
                        </Link>
                    </div>

                    {/* LISTA DE TARJETAS */}
                    <div className="space-y-8">
                        {pisuak.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-200">
                                <p className="text-xl text-gray-500">Ez duzu pisurik oraindik.</p>
                            </div>
                        ) : (
                            pisuak.map((pisua, index) => {
                                // CAMBIO AQUÍ: Usamos la nueva paleta rotativa
                                const cardColor = cardBackgroundColors[index % cardBackgroundColors.length];
                                
                                return (
                                    <div key={pisua.id} className={`${cardColor} rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row min-h-[280px] transition-transform hover:scale-[1.01]`}>
                                        
                                        {/* Imagen (Izquierda) */}
                                        <div className="md:w-5/12 relative bg-gray-200">
                                            {pisua.imagen_path ? (
                                                <img 
                                                    src={`/storage/${pisua.imagen_path}`} 
                                                    alt={pisua.izena} 
                                                    className="w-full h-full object-cover min-h-[250px]"
                                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Irudia+Falta'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col gap-2 min-h-[250px]">
                                                     <span className="text-4xl">🏠</span>
                                                     <span className="text-sm">Argazkirik ez</span>
                                                </div>
                                            )}
                                            
                                            {/* Etiqueta ADMIN (Si eres el dueño) */}
                                            {pisua.rol_actual === 'admin' && (
                                                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded uppercase font-bold backdrop-blur-sm">
                                                    Nire Pisua
                                                </span>
                                            )}
                                        </div>

                                        {/* Contenido (Derecha) */}
                                        <div className="md:w-7/12 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{pisua.izena}</h3>
                                                </div>

                                                {/* Dirección */}
                                                {pisua.helbidea && (
                                                    <p className="flex items-center gap-1 text-sm text-gray-600 mb-3 font-medium">
                                                        <MapPin size={16} />
                                                        {pisua.helbidea}
                                                    </p>
                                                )}

                                                {/* Descripción */}
                                                <p className="text-lg text-gray-700 leading-relaxed mb-4 line-clamp-3">
                                                    {pisua.deskripzioa || "Deskripziorik gabe"}
                                                </p>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-4 gap-4">
                                                
                                                {/* Lista de Miembros */}
                                                <div className="flex flex-wrap gap-2">
                                                    {pisua.users && pisua.users.length > 0 ? (
                                                        pisua.users.map((miembro, idx) => {
                                                            const isAdmin = pisua.user_id === miembro.id;
                                                            const colorClass = memberColors[idx % memberColors.length];

                                                            return (
                                                                <span 
                                                                    key={miembro.id}
                                                                    className={`
                                                                        px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1
                                                                        ${colorClass}
                                                                        ${isAdmin ? 'ring-2 ring-yellow-500/50' : ''}
                                                                    `}
                                                                    title={isAdmin ? 'Pisoaren Administraria' : 'Kidea'}
                                                                >
                                                                    {isAdmin && <span>👑</span>}
                                                                    {miembro.name}
                                                                </span>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-sm text-gray-600 italic">Kiderik ez</span>
                                                    )}
                                                </div>

                                                {/* Botón SARTU */}
                                                <Link 
                                                    href={`/pisua/${pisua.id}`} 
                                                    className="w-full sm:w-auto text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    SARTU
                                                    <ArrowRightCircle size={18}/>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}