import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/Components/Footer';
import { ArrowRightCircle, Plus } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Pisua {
    id: number;
    izena: string;
    deskripzioa?: string;
    imagen_path?: string;
    kodigoa: string;
    rol_actual: 'admin' | 'kide';
    miembros: User[];
}

interface Props {
    pisuak: Pisua[];
}

export default function NirePisuak({ pisuak }: Props) {
    
    // Función para asignar colores aleatorios a los nombres (estilo visual)
    const getColorForName = (name: string) => {
        const colors = [
            'bg-pink-400 text-pink-900',
            'bg-yellow-300 text-yellow-900',
            'bg-orange-400 text-orange-900',
            'bg-blue-300 text-blue-900',
            'bg-green-300 text-green-900',
        ];
        // Usamos la longitud del nombre para elegir un color fijo
        return colors[name.length % colors.length];
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white p-6 md:p-10">
                <Head title="Nire Pisuak" />
                
                <div className="max-w-6xl mx-auto">
                    
                    {/* Título y Botón */}
                    <div className="flex justify-between items-center mb-8 border-b-2 border-red-500 pb-4">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <span className="text-4xl">👥</span> Pisuak
                        </h2>
                        <Link 
                            href="/pisua/sortu" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow flex items-center gap-2 transition-transform hover:scale-105"
                        >
                            <Plus size={20} />
                            Gehitu pisua
                        </Link>
                    </div>

                    {/* Lista de Tarjetas */}
                    <div className="space-y-8">
                        {pisuak.length === 0 ? (
                            <div className="text-center py-20 bg-gray-100 rounded-xl">
                                <p className="text-xl text-gray-500">Ez duzu pisurik oraindik.</p>
                            </div>
                        ) : (
                            pisuak.map((pisua, index) => {
                                // Alternar colores de fondo de la tarjeta (Verde / Amarillo pastel)
                                const cardColor = index % 2 === 0 ? 'bg-[#A8D5BA]' : 'bg-[#FCE38A]';
                                
                                return (
                                    <div key={pisua.id} className={`${cardColor} rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row min-h-[280px]`}>
                                        
                                        {/* Imagen (Izquierda) */}
                                        <div className="md:w-5/12 relative">
                                            {pisua.imagen_path ? (
                                                <img 
                                                    src={`/storage/${pisua.imagen_path}`} 
                                                    alt={pisua.izena} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 flex-col gap-2">
                                                     <span>🏠</span>
                                                     <span className="text-sm">Argazkirik ez</span>
                                                </div>
                                            )}
                                            
                                            {/* Etiqueta de Rol */}
                                            {pisua.rol_actual === 'admin' && (
                                                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded uppercase font-bold">
                                                    Admin
                                                </span>
                                            )}
                                        </div>

                                        {/* Contenido (Derecha) */}
                                        <div className="md:w-7/12 p-6 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-3xl font-bold text-gray-800 mb-2">{pisua.izena}</h3>
                                                <p className="text-lg text-gray-800 font-medium mb-4">
                                                    {pisua.deskripzioa || "Deskripziorik gabe"}
                                                </p>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                {/* Lista de Miembros (Pills de colores) */}
                                                <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                                                    {pisua.miembros.length > 0 ? (
                                                        pisua.miembros.map(miembro => (
                                                            <span 
                                                                key={miembro.id}
                                                                className={`${getColorForName(miembro.name)} px-4 py-1.5 rounded-full text-sm font-bold shadow-sm`}
                                                            >
                                                                {miembro.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-gray-600 italic">Kiderik ez</span>
                                                    )}
                                                </div>

                                                {/* Botón SARTU */}
                                                <Link 
                                                    // TODO: Aquí pondremos la ruta para entrar al piso
                                                    href={`/pisua/${pisua.id}`} 
                                                    className="bg-[#2C3E50] hover:bg-[#34495e] text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-colors ml-4"
                                                >
                                                    SARTU
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