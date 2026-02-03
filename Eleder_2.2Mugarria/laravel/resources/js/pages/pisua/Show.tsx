import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer'; // Asegúrate de la mayúscula si tu carpeta es Components
import PisuaHeader from '@/Components/PisuaHeader'; 
import { Edit, Trash2, UserPlus, PenLine, X, ChevronLeft, ChevronRight, Crown, Search, PlusCircle, CheckCircle, Circle, Clock, User as UserIcon } from 'lucide-react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 

// Estilos para ocultar la barra de scroll y customizar calendario visualmente
const customStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  /* Estilos del calendario para que coincidan con el diseño original */
  .react-calendar { border: none; width: 100%; font-family: inherit; background: transparent; }
  .react-calendar__tile { height: 60px; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding: 5px !important; }
  .react-calendar__tile--active { background: #6366f1 !important; color: white; border-radius: 8px; }
  .react-calendar__tile--now { background: #e0e7ff; border-radius: 8px; }
  .react-calendar__month-view__days__day--neighboringMonth { color: #9ca3af !important; }
  abbr[title] { text-decoration: none !important; }
`;

// --- INTERFACES (Si usas TypeScript) ---
interface User {
    id: number;
    name: string;
    email: string;
}

interface Zeregina {
    id: number;
    izenburua: string;
    eginda: boolean;
    muga_data: string;
    arduraduna_id: number;
    arduraduna?: User;
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
    zereginak?: Zeregina[];
}

// --- KOLOREEN LOGIKA (PARA TAREAS) ---
const KOLOREAK = [
    '#FFadad', '#ffd6a5', '#fdffb6', '#caffbf', 
    '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff',
];

const lortuKolorea = (id: number) => {
    return KOLOREAK[id % KOLOREAK.length];
};

export default function Show({ pisua, isAdmin, zereginak = [] }: ShowProps) {
    const [activeTab, setActiveTab] = useState('informazioa');
    
    // Modales
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Scroll Logic (Miembros)
    const [showArrows, setShowArrows] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- LOGICA DE ZEREGINAK (TAREAS) ---
    const [bilaketaTerminoa, setBilaketaTerminoa] = useState('');
    const [dataHautatua, setDataHautatua] = useState<any>(new Date());

    // Data minimoa kalkulatu (para el formulario de tareas)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const minDataString = getMinDateTime();

    // 1. Formulario para Añadir Miembro
    const { data: memberData, setData: setMemberData, post: postMember, processing: processingMember, errors: memberErrors, reset: resetMember } = useForm({
        email: '',
    });

    // 2. Formulario para Añadir Tarea
    const { data: taskData, setData: setTaskData, post: postTask, processing: processingTask, errors: taskErrors, reset: resetTask } = useForm({
        izenburua: '',
        muga_data: '',
        arduraduna_id: '',
        pisua_id: pisua.id 
    });

    // --- HANDLERS MIEMBROS ---
    const submitAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        postMember(`/pisua/${pisua.id}/add-member`, {
            onSuccess: () => { setIsMemberModalOpen(false); resetMember(); }
        });
    };

    // --- HANDLERS TAREAS ---
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value; 
        if (!inputVal) {
            setTaskData('muga_data', '');
            return;
        }
        const selectedDate = new Date(inputVal);
        const now = new Date();
        now.setSeconds(0, 0);

        if (selectedDate < now) {
            alert("Ezin duzu iraganeko data edo ordu bat aukeratu.");
            setTaskData('muga_data', minDataString); 
        } else {
            setTaskData('muga_data', inputVal);
        }
    };

    const submitAddTask = (e: FormEvent) => {
        e.preventDefault();
        postTask('/zereginak', {
            onSuccess: () => { setIsTaskModalOpen(false); resetTask(); }
        });
    };

    const toggleZeregina = (zeregina: Zeregina) => {
        router.put(`/zereginak/${zeregina.id}`, {
            eginda: !zeregina.eginda
        }, { preserveScroll: true });
    };

    const deleteZeregina = (id: number) => {
        if(confirm("Ziur al zaude zeregin hau ezabatu nahi duzula?")) {
            router.delete(`/zereginak/${id}`, { preserveScroll: true });
        }
    };

    // Filtros de búsqueda
    const zereginakFiltratuak = zereginak.filter(z => 
        z.izenburua.toLowerCase().includes(bilaketaTerminoa.toLowerCase())
    );

    // --- UTILS ---
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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = 300;
            container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const getCardColor = (userId: number, index: number) => {
        if (userId === pisua.user_id) return 'bg-[#ff80bf]';
        const otherColors = ['bg-[#FFD700]', 'bg-[#FF9F43]', 'bg-[#3dcbe3]'];
        return otherColors[index % otherColors.length];
    };

    // --- FORMATUAK (TAREAS) ---
    const formatuData = (dataString: string) => {
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? 'Data okerra' : data.toISOString().split('T')[0].replace(/-/g, '/');
    };

    const formatuOrdua = (dataString: string) => {
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? '--:--' : data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Egutegiko edukia (Puntos de colores)
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const egunekoZereginak = zereginak.filter((z) => {
                const zereginData = new Date(z.muga_data);
                return (
                    zereginData.getDate() === date.getDate() &&
                    zereginData.getMonth() === date.getMonth() &&
                    zereginData.getFullYear() === date.getFullYear()
                );
            });

            if (egunekoZereginak.length > 0) {
                return (
                    <div className="flex justify-center gap-1 mt-1 flex-wrap px-1">
                        {egunekoZereginak.map((z) => (
                            <div 
                                key={z.id}
                                style={{ backgroundColor: z.arduraduna ? lortuKolorea(z.arduraduna.id) : '#ccc' }}
                                className="w-2 h-2 rounded-full"
                                title={z.izenburua} 
                            />
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-white">
            <style>{customStyles}</style>
            <Header />
            <Head title={pisua.izena} />

            <main className="flex-grow">
                <PisuaHeader pisua={pisua} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="max-w-7xl mx-auto p-8 min-h-[600px]">
                    
                    {/* --- PESTAÑA INFORMACIÓN --- */}
                    {activeTab === 'informazioa' && (
                        <div className="animate-fade-in space-y-6">
                            <div className="bg-[#9EE4B8] rounded-xl p-8 relative shadow-sm">
                                {isAdmin && (
                                    <div className="absolute top-6 right-6">
                                        <Link href={`/pisua/${pisua.id}/edit`} className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-lg shadow-md transition font-medium">
                                            <PenLine size={18} /> Editatu informazioa
                                        </Link>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="max-w-3xl mt-2">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">Deskripzioa</h2>
                                        <div className="bg-white/20 p-4 rounded-lg border border-white/30 backdrop-blur-sm w-full">
                                            <p className="text-gray-800 leading-relaxed font-medium line-clamp-3">{pisua.deskripzioa || "Ez dago deskripziorik."}</p>
                                        </div>
                                    </div>

                                    {/* Carrusel Usuarios */}
                                    <div className="w-full relative group">
                                        <div className="flex justify-between items-center mb-4">
                                            {isAdmin ? (
                                                <button onClick={() => setIsMemberModalOpen(true)} className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2 rounded-lg shadow-md font-medium transition">
                                                    <UserPlus size={20} /> Gehitu pisukidea
                                                </button>
                                            ) : <div />}
                                            {showArrows && (
                                                <div className="flex gap-3">
                                                    <button onClick={() => scroll('left')} className="p-2 rounded-full bg-[#6366f1] text-white"><ChevronLeft size={22} /></button>
                                                    <button onClick={() => scroll('right')} className="p-2 rounded-full bg-[#6366f1] text-white"><ChevronRight size={22} /></button>
                                                </div>
                                            )}
                                        </div>
                                        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-6 pb-4 scroll-smooth no-scrollbar items-start">
                                            {pisua.users && pisua.users.map((user, index) => (
                                                <div key={user.id} className={`${getCardColor(user.id, index)} relative flex-shrink-0 w-44 h-44 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-between border border-black/5 hover:scale-105 transition-transform`}>
                                                    {user.id === pisua.user_id && <div className="absolute top-3 right-3 bg-black/10 p-1.5 rounded-full"><Crown size={16}/></div>}
                                                    <div className="flex-grow flex items-center justify-center"><span className="font-bold text-gray-900 text-lg text-center">{user.name}</span></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#C4CDD5] p-8 rounded-xl shadow-sm h-48 flex flex-col justify-center">
                                    <h3 className="text-2xl text-gray-800 font-bold mb-2">Zereginak</h3>
                                    <span className="text-4xl font-normal text-gray-900">{zereginak.length}</span>
                                    <span className="text-gray-600 mt-1">{zereginak.filter(z => !z.eginda).length} zain</span>
                                </div>
                                <div className="bg-[#C4CDD5] p-8 rounded-xl shadow-sm h-48 flex flex-col justify-center">
                                    <h3 className="text-2xl text-gray-800 font-bold mb-2">Gastuak</h3>
                                    <span className="text-4xl font-normal text-gray-900">0,00€</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PESTAÑA ZEREGINAK (DISEÑO ORIGINAL) --- */}
                    {activeTab === 'zereginak' && (
                        <div className="animate-fade-in space-y-12">
                            
                            {/* LISTA Y BUSCADOR (Estilo original) */}
                            <div className="bg-[#8da2c0] rounded-xl shadow-lg p-0 pb-16 relative">
                                <div className="flex justify-between items-center p-5">
                                    <h2 className="text-lg font-medium text-gray-900">Zereginen zerrenda</h2>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            placeholder="Bilatu..."
                                            className="w-40 pl-4 pr-10 py-1 rounded-full bg-white border-none text-sm focus:ring-2 focus:ring-indigo-400"
                                            value={bilaketaTerminoa}
                                            onChange={(e) => setBilaketaTerminoa(e.target.value)}
                                        />
                                        <Search className="w-4 h-4 absolute right-3 top-1.5 text-gray-500" />
                                    </div>
                                </div>

                                <div className="px-3 space-y-2">
                                    {zereginakFiltratuak.length === 0 ? (
                                        <div className="bg-white/80 rounded-lg p-10 text-center">
                                            <p className="text-gray-600">Ez dago zereginik irizpide hauekin.</p>
                                        </div>
                                    ) : (
                                        zereginakFiltratuak.map((zeregina) => {
                                            const mugaData = new Date(zeregina.muga_data);
                                            const orain = new Date();
                                            const epeaPasata = mugaData < orain;

                                            const testuEstiloa = zeregina.eginda 
                                                ? 'line-through opacity-50 text-gray-500 font-medium' 
                                                : epeaPasata 
                                                    ? 'text-red-600 font-bold' 
                                                    : 'text-gray-900 font-medium';

                                            const dataEstiloa = !zeregina.eginda && epeaPasata
                                                ? 'text-red-600 font-bold'
                                                : 'text-gray-700';

                                            return (
                                                <div key={zeregina.id} className="bg-[#dee5f0] rounded-lg p-4 flex items-center justify-between shadow-sm transition-all hover:shadow-md">
                                                    <div className="flex items-center gap-4">
                                                        <input 
                                                            type="checkbox"
                                                            checked={zeregina.eginda}
                                                            onChange={() => toggleZeregina(zeregina)}
                                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                        />
                                                        <button onClick={() => deleteZeregina(zeregina.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded transition">
                                                            Ezabatu
                                                        </button>
                                                        
                                                        <span className={testuEstiloa}>
                                                            {zeregina.izenburua}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className={`text-sm font-mono flex gap-4 ${dataEstiloa}`}>
                                                            <span>{formatuData(zeregina.muga_data)}</span>
                                                            <span>{formatuOrdua(zeregina.muga_data)}</span>
                                                        </div>
                                                        
                                                        {zeregina.arduraduna ? (
                                                            <span 
                                                                className="px-4 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-sm border border-white/20"
                                                                style={{ backgroundColor: lortuKolorea(zeregina.arduraduna.id) }}
                                                            >
                                                                {zeregina.arduraduna.name}
                                                            </span>
                                                        ) : (
                                                            <span className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm">
                                                                ?
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Botón de crear tarea (flotante) */}
                                <div className="absolute -bottom-6 right-8 flex flex-col items-center z-10">
                                    <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-2 bg-[#6366f1] text-white px-8 py-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition">
                                        <PlusCircle className="w-5 h-5" />
                                        <span className="font-semibold text-sm">Zeregin berria</span>
                                    </button>
                                </div>
                            </div>

                            {/* CALENDARIO (Debajo de la lista) */}
                            <div className="max-w-3xl mx-auto p-6 flex justify-center calendar-container text-lg bg-white rounded-xl shadow-sm border border-gray-100">
                                <Calendar 
                                    onChange={setDataHautatua} 
                                    value={dataHautatua}
                                    locale="eu-ES" 
                                    tileContent={tileContent} 
                                    className="border-none w-full"
                                />
                            </div>
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

            {/* --- MODAL AÑADIR MIEMBRO --- */}
            {isMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Gehitu erabiltzailea</h3>
                            <button onClick={() => setIsMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={submitAddMember} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Emaila</label>
                                <input type="email" value={memberData.email} onChange={e => setMemberData('email', e.target.value)} placeholder="laguna@email.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" autoFocus />
                                {memberErrors.email && <p className="text-red-500 text-sm mt-2">{memberErrors.email}</p>}
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold">Utzi</button>
                                <button type="submit" disabled={processingMember} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold">{processingMember ? 'Gehitzen...' : 'Gehitu'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL AÑADIR TAREA (Estilo original) --- */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="flex justify-center items-center p-5 border-b relative">
                            <h3 className="text-xl font-bold tracking-wide">ZEREGIN BERRIA</h3>
                            <button onClick={() => setIsTaskModalOpen(false)} className="absolute right-5 text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={submitAddTask} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Kontzeptua</label>
                                <input 
                                    type="text" 
                                    value={taskData.izenburua} 
                                    onChange={e => {
                                        setTaskData('izenburua', e.target.value);
                                        e.target.setCustomValidity(''); 
                                    }}
                                    onInvalid={e => e.currentTarget.setCustomValidity('Mesedez, bete eremu hau.')}
                                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 py-2 bg-gray-50" 
                                    required 
                                    placeholder="Adib: Zaborra bota" 
                                />
                                {taskErrors.izenburua && <div className="text-red-500 text-xs mt-1">{taskErrors.izenburua}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Nork</label>
                                <div className="relative">
                                    <select
                                        value={taskData.arduraduna_id}
                                        onChange={e => {
                                            setTaskData('arduraduna_id', e.target.value);
                                            e.target.setCustomValidity('');
                                        }}
                                        onInvalid={e => e.currentTarget.setCustomValidity('Mesedez, arduradun bat aukeratu.')}
                                        className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 py-2 pl-3 pr-10 appearance-none bg-gray-50"
                                        required
                                    >
                                        <option value="" disabled>Aukeratu pisukidea...</option>
                                        {pisua.users && pisua.users.map((erabiltzailea) => (
                                            <option key={erabiltzailea.id} value={erabiltzailea.id}>
                                                {erabiltzailea.name}
                                            </option>
                                        ))}
                                    </select>
                                    <UserIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                                </div>
                                {taskErrors.arduraduna_id && <div className="text-red-500 text-xs mt-1">{taskErrors.arduraduna_id}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Noiz eta Ordua</label>
                                <div className="relative">
                                    <input 
                                        type="datetime-local" 
                                        value={taskData.muga_data} 
                                        onChange={e => {
                                            handleDateChange(e);
                                            e.target.setCustomValidity('');
                                        }}
                                        onInvalid={e => e.currentTarget.setCustomValidity('Mesedez, bete eremu hau.')}
                                        className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 py-2 bg-gray-50" 
                                        required 
                                        min={minDataString} 
                                    />
                                </div>
                                {taskErrors.muga_data && <div className="text-red-500 text-xs mt-1">{taskErrors.muga_data}</div>}
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={processingTask} className="w-full py-3 bg-[#8da2c0] hover:bg-[#7b8ea8] text-white rounded-lg font-bold text-lg shadow-md transition">
                                    {processingTask ? 'Gordetzen...' : 'Gehitu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}