import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';
import { ArrowRightCircle, Plus, MapPin, Image, Crown } from 'lucide-react';

// --- ESTILOS PARA SCROLLBAR PERSONALIZADO ---
const scrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
    border: 1px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(107, 114, 128, 0.8);
  }
`;

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

const memberColors = [
    'bg-pink-300 text-pink-900',
    'bg-yellow-300 text-yellow-900',
    'bg-orange-300 text-orange-900',
    'bg-blue-300 text-blue-900',
    'bg-green-300 text-green-900',
    'bg-purple-300 text-purple-900',
];

const cardBackgroundColors = [
    'bg-emerald-100', 
    'bg-amber-100',   
    'bg-blue-100',    
    'bg-rose-100',    
    'bg-indigo-100',  
    'bg-teal-100',    
];


export default function NirePisuak({ pisuak }: Props) {
    
    return (
        <>
            <style>{scrollbarStyle}</style>
            <Header />
            <div className="min-h-screen bg-gray-50 p-6 md:p-10">
                <Head title="Nire Pisuak">                    
                    <title>Nire Pisuak</title>
                    <meta name="description" content="Kudeatu zure pisuak erraz." />
                    {/* Facebook/WhatsApp-erako gainidatzi */}
                    <meta property="og:title" content="Pisuak Zerrenda - Pear" />
                    <meta property="og:description" content="Hona hemen pisuen zerrenda." />
                </Head>
                
                <div className="max-w-6xl mx-auto">
                    
                    {/* ENCABEZADO */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                            <span className="text-4xl"></span> Pisuak
                        </h2>
                        
                        <Link 
                            href={"/pisua/sortu"} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Sortu Pisua
                        </Link>
                    </div>

                    {/* LISTA DE PISOS */}
                    <div className="max-h-[750px] overflow-y-auto custom-scrollbar p-2 space-y-8 pr-4">
                        {pisuak.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-200">
                                <p className="text-xl text-gray-500">Ez duzu pisurik oraindik.</p>
                            </div>
                        ) : (
                            pisuak.map((pisua, index) => {
                                const cardColor = cardBackgroundColors[index % cardBackgroundColors.length];
                                
                                return (
                                    <div key={pisua.id} className={`${cardColor} rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row transition-transform hover:scale-[1.01]
                                        h-auto md:h-[340px]
                                    `}>
                                        
                                        {/* Imagen (Izquierda) */}
                                        <div className="w-full md:w-5/12 relative bg-gray-200 h-64 md:h-full shrink-0">
                                            {pisua.imagen_path ? (
                                                <img 
                                                    src={`/storage/${pisua.imagen_path}`} 
                                                    alt={pisua.izena} 
                                                    className="w-full h-full object-cover" 
                                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Irudia+Falta'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col gap-2">
                                                     <span className="text-4xl"><Image/></span>
                                                     <span className="text-sm">Argazkirik ez</span>
                                                </div>
                                            )}
                                            
                                            {pisua.rol_actual === 'admin' && (
                                                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded uppercase font-bold backdrop-blur-sm">
                                                    Nire Pisua
                                                </span>
                                            )}
                                        </div>

                                        {/* Contenido (Derecha) */}
                                        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between h-full overflow-hidden">
                                            
                                            {/* Bloque Superior: Título, Dir, Desc */}
                                            <div className="min-w-0"> 
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-3xl font-bold text-gray-800 mb-1 truncate pr-2" title={pisua.izena}>
                                                        {pisua.izena}
                                                    </h3>
                                                </div>

                                                {pisua.helbidea && (
                                                    <p className="flex items-center gap-1 text-sm text-gray-600 mb-3 font-medium">
                                                        <MapPin size={16} className="shrink-0" />
                                                        <span className="truncate" title={pisua.helbidea}>{pisua.helbidea}</span>
                                                    </p>
                                                )}

                                                {/* --- CAMBIO: SCROLL VERTICAL --- */}
                                                {/* 'max-h-32': Altura máxima */}
                                                {/* 'overflow-y-auto': Scroll vertical si hace falta */}
                                                {/* 'overflow-x-hidden': Prohibido scroll horizontal */}
                                                {/* 'break-words': Rompe palabras largas para que no se salgan */}
                                                <p className="text-lg text-gray-700 leading-relaxed mb-4 max-h-32 overflow-y-auto overflow-x-hidden break-words custom-scrollbar pr-1" title={pisua.deskripzioa || ''}>
                                                    {pisua.deskripzioa || "Deskripziorik gabe"}
                                                </p>
                                            </div>

                                            {/* Bloque Inferior: Usuarios y Botón */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-auto gap-4">
                                                
                                                {/* Lista de Miembros */}
                                                <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto custom-scrollbar pr-2 w-full sm:w-auto">
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
                                                                    {isAdmin && <span><Crown size={14}/></span>}
                                                                    {miembro.name}
                                                                </span>
                                                            );
                                                        })
                                                    ) : (
                                                        <span className="text-sm text-gray-600 italic">Kiderik ez</span>
                                                    )}
                                                </div>

                                                <Link 
                                                    href={`/pisua/${pisua.id}`} 
                                                    className="w-full sm:w-auto text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors shrink-0"
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