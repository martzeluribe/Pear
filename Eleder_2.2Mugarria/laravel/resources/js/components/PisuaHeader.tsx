import React from 'react';
import { MapPin } from 'lucide-react';

interface Pisua {
    id: number;
    izena: string;
    helbidea?: string;
    imagen_path?: string;
}

interface PisuaHeaderProps {
    pisua: Pisua;
    activeTab: string; 
    onTabChange: (tab: string) => void;
}

export default function PisuaHeader({ pisua, activeTab, onTabChange }: PisuaHeaderProps) {
    
    const bgImage = pisua.imagen_path 
        ? `/storage/${pisua.imagen_path}` 
        : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"; 

    // Estilos para los botones del menú (Nav)
    const getNavBtnClass = (isActive: boolean, isLast: boolean) => 
        `flex-1 py-2 text-center transition-colors font-medium text-sm sm:text-base
        ${!isLast ? 'border-r border-gray-500' : ''} 
        ${isActive 
            ? 'text-black font-bold' 
            : 'text-gray-700 hover:text-black' 
        }`;

    return (
        // CONTENEDOR PRINCIPAL
        // 1. max-w-screen-2xl: Permite que sea mucho más ancho que antes (hasta 1536px).
        // 2. px-2: Reduce el espacio libre a los lados (padding lateral) al mínimo.
        <div className="w-full max-w-screen-2xl mx-auto px-2 mt-4">
            
            {/* 1. SECCIÓN DE IMAGEN (HERO) */}
            <div className="relative h-64 w-full bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-4">
                <img 
                    src={bgImage} 
                    alt={pisua.izena} 
                    className="w-full h-full object-cover opacity-60"
                />
                
                <div className="absolute bottom-0 left-0 p-8 text-white w-full bg-gradient-to-t from-black/80 to-transparent">
                    <h1 
                        className="text-4xl font-bold uppercase tracking-wider max-w-5xl truncate"
                        title={pisua.izena}
                    >
                        {pisua.izena}
                    </h1>
                    
                    <div 
                        className="flex items-center gap-2 mt-1 opacity-90 max-w-5xl" 
                        title={pisua.helbidea}
                    >
                        <MapPin size={20} className="shrink-0" /> 
                        <span className="text-lg truncate">
                            {pisua.helbidea || 'Helbidea zehaztu gabe'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. SECCIÓN DE NAVEGACIÓN (NAV) */}
            <div className="w-full">
                <div className="bg-gray-300 rounded-full flex items-center justify-between p-1 shadow-sm">
                    
                    <button 
                        onClick={() => onTabChange('informazioa')} 
                        className={getNavBtnClass(activeTab === 'informazioa', false)}
                    >
                        Informazioa
                    </button>

                    <button 
                        onClick={() => onTabChange('zereginak')} 
                        className={getNavBtnClass(activeTab === 'zereginak', false)}
                    >
                        Zereginak
                    </button>

                    <button 
                        onClick={() => onTabChange('gastuak')} 
                        className={getNavBtnClass(activeTab === 'gastuak', true)}
                    >
                        Gastuak
                    </button>

                </div>
            </div>
        </div>
    );
}