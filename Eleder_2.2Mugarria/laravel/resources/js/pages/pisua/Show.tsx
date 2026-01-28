import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';
import PisuaHeader from '@/Components/PisuaHeader'; 
import { Edit, Trash2, UserPlus, PenLine, X, ChevronLeft, ChevronRight, Crown } from 'lucide-react';

// Estilos para ocultar la barra de scroll
const hideScrollbarStyle = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
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
    kodigoa: string;
    imagen_path?: string;
    users?: User[];
    user_id: number; 
}

interface ShowProps {
    pisua: Pisua;
    isAdmin: boolean; 
}

export default function Show({ pisua, isAdmin }: ShowProps) {
    const [activeTab, setActiveTab] = useState('informazioa');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Controlar si se muestran las flechas
    const [showArrows, setShowArrows] = useState(false);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    // --- LÓGICA DE DETECCIÓN DE SCROLL ---
    useEffect(() => {
        const checkScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowArrows(scrollWidth > clientWidth);
            }
        };

        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [pisua.users]);

    // --- LÓGICA DE MOVIMIENTO DE SCROLL (MODIFICADA: Salta de 3 en 3) ---
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            
            // Intentamos obtener el ancho real de la primera tarjeta
            const firstCard = container.firstElementChild as HTMLElement;

            if (firstCard) {
                // w-44 es 176px y gap-6 es 24px. 
                // Sumamos el ancho de la tarjeta + el gap para saber cuánto ocupa 1 item completo
                const cardWidth = firstCard.offsetWidth; 
                const gap = 24; // Valor en px de 'gap-6' en Tailwind default
                
                // Multiplicamos por 3 para saltar 3 miembros
                const scrollAmount = (cardWidth + gap) * 3; 
                
                if (direction === 'left') {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            } else {
                // Fallback por si no hay hijos renderizados aún (600px es aprox 3 items)
                const fallbackAmount = 600;
                container.scrollBy({ 
                    left: direction === 'left' ? -fallbackAmount : fallbackAmount, 
                    behavior: 'smooth' 
                });
            }
        }
    };

    const getCardColor = (userId: number, index: number) => {
        if (userId === pisua.user_id) return 'bg-[#ff80bf]';
        const otherColors = ['bg-[#FFD700]', 'bg-[#FF9F43]', 'bg-[#3dcbe3]'];
        return otherColors[index % otherColors.length];
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-white">
            <style>{hideScrollbarStyle}</style>
            <Header />
            <Head title={pisua.izena} />

            <main className="flex-grow">
                <PisuaHeader 
                    pisua={pisua} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />

                <div className="max-w-7xl mx-auto p-8 min-h-[600px]">
                    
                    {activeTab === 'informazioa' && (
                        <div className="animate-fade-in space-y-6">
                            
                            <div className="bg-[#9EE4B8] rounded-xl p-8 relative shadow-sm">
                                
                                {isAdmin && (
                                    <div className="absolute top-6 right-6">
                                        <Link 
                                            href={`/pisua/${pisua.id}/edit`}
                                            className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-lg shadow-md transition font-medium"
                                        >
                                            <PenLine size={18} />
                                            Editatu informazioa
                                        </Link>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="max-w-3xl mt-2">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">Deskripzioa</h2>
                                        <div className="bg-white/20 p-4 rounded-lg border border-white/30 backdrop-blur-sm w-full">
                                            <p 
                                                className="text-gray-800 leading-relaxed font-medium line-clamp-3 overflow-hidden break-words w-full"
                                                title={pisua.deskripzioa}
                                            >
                                                {pisua.deskripzioa || "Ez dago deskripziorik."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* --- CARRUSEL DE USUARIOS --- */}
                                    <div className="w-full relative group">
                                        
                                        <div className="flex justify-between items-center mb-4">
                                            {isAdmin ? (
                                                <button 
                                                    onClick={() => setIsModalOpen(true)}
                                                    className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
                                                >
                                                    <UserPlus size={20} />
                                                    Gehitu pisukidea
                                                </button>
                                            ) : (
                                                <div />
                                            )}

                                            {/* FLECHAS DE NAVEGACIÓN */}
                                            {showArrows && (
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => scroll('left')}
                                                        className="p-2 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white transition shadow-md border border-white/10 active:scale-95"
                                                        aria-label="Scroll left"
                                                    >
                                                        <ChevronLeft size={22} strokeWidth={2.5} />
                                                    </button>
                                                    <button 
                                                        onClick={() => scroll('right')}
                                                        className="p-2 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white transition shadow-md border border-white/10 active:scale-95"
                                                        aria-label="Scroll right"
                                                    >
                                                        <ChevronRight size={22} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div 
                                            ref={scrollContainerRef}
                                            className="flex overflow-x-auto gap-6 pb-4 scroll-smooth no-scrollbar items-start"
                                        >
                                            {pisua.users && pisua.users.length > 0 ? (
                                                pisua.users.map((user, index) => {
                                                    const isOwner = user.id === pisua.user_id;

                                                    return (
                                                        <div 
                                                            key={user.id} 
                                                            className={`${getCardColor(user.id, index)} relative flex-shrink-0 w-44 h-44 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-between border border-black/5 transition-transform hover:scale-105 overflow-hidden`}
                                                        >
                                                            {isOwner && (
                                                                <div className="absolute top-3 right-3 bg-black/10 p-1.5 rounded-full z-10" title="Pisuaren jabea">
                                                                    <Crown size={16} className="text-gray-900" strokeWidth={2.5} />
                                                                </div>
                                                            )}

                                                            <div className="flex-grow flex items-center justify-center w-full mt-2 px-1">
                                                                <span 
                                                                    className="font-bold text-gray-900 text-lg text-center leading-tight break-words line-clamp-2 overflow-hidden w-full"
                                                                    title={user.name}
                                                                >
                                                                    {user.name}
                                                                </span>
                                                            </div>
                                                            
                                                            {isAdmin && (
                                                                <div className="flex gap-3 pt-2 w-full justify-center flex-shrink-0">
                                                                    <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-2 rounded-lg shadow-sm transition border border-black/10 flex items-center justify-center">
                                                                        <Edit size={18}/>
                                                                    </button>
                                                                    <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-sm transition border border-black/10 flex items-center justify-center">
                                                                        <Trash2 size={18}/>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-gray-600 italic">Oraindik ez dago inor pisu honetan.</p>
                                            )}
                                            
                                            <div className="w-1 flex-shrink-0"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#C4CDD5] p-8 rounded-xl shadow-sm h-48 flex flex-col justify-center">
                                    <h3 className="text-2xl text-gray-800 font-bold mb-2">Zereginak</h3>
                                    <span className="text-4xl font-normal text-gray-900">1</span>
                                    <span className="text-gray-600 mt-1">0 zain</span>
                                </div>
                                <div className="bg-[#C4CDD5] p-8 rounded-xl shadow-sm h-48 flex flex-col justify-center">
                                    <h3 className="text-2xl text-gray-800 font-bold mb-2">Gastuak</h3>
                                    <span className="text-4xl font-normal text-gray-900">0,00€</span>
                                </div>
                            </div>

                        </div>
                    )}

                    {activeTab === 'zereginak' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Zereginen zerrenda</h2>
                            <p className="text-gray-600">Hemen zereginen taula agertuko da.</p>
                        </div>
                    )}

                    {activeTab === 'gastuak' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gastuen kudeaketa</h2>
                            <p className="text-gray-600">Hemen gastuen zerrenda agertuko da.</p>
                        </div>
                    )}

                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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