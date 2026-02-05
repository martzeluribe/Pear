import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/components/footer';
import PisuaHeader from '@/components/PisuaHeader';
import GastuModal from '@/components/GastuModal';
import { Edit, Trash2, UserPlus, PenLine, X, ChevronLeft, ChevronRight, Crown, Search, PlusCircle, User as UserIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Estilos para ocultar la barra de scroll y customizar calendario visualmente
const customStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .react-calendar { border: none; width: 100%; font-family: inherit; background: transparent; }
  .react-calendar__tile { height: 60px; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding: 5px !important; }
  .react-calendar__tile--active { background: #6366f1 !important; color: white; border-radius: 8px; }
  .react-calendar__tile--now { background: #e0e7ff; border-radius: 8px; }
  .react-calendar__month-view__days__day--neighboringMonth { color: #9ca3af !important; }
  abbr[title] { text-decoration: none !important; }
  /* Estilo para el scroll personalizado de gastos y balantzea */
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #c7c7c7; border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
`;

// --- INTERFACES ---
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

interface Gastua {
    id: number;
    konzeptua: string;
    zenbatekoa: number;
    data: string;
    ordaintzailea: User;
    partaideak: User[];
}

interface BalantzeaUser {
    id: number;
    name: string;
    saldo: number;
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
    gastuak?: Gastua[];
    balantzea?: BalantzeaUser[];
}

// --- KOLOREEN LOGIKA (PARA TAREAS) ---
const KOLOREAK = [
    '#FFadad', '#ffd6a5', '#fdffb6', '#caffbf',
    '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff',
];

const lortuKolorea = (id: number) => {
    return KOLOREAK[id % KOLOREAK.length];
};

export default function Show({ pisua, isAdmin, zereginak = [], gastuak = [], balantzea = [] }: ShowProps) {
    const { auth } = usePage().props as any;
    const [activeTab, setActiveTab] = useState('informazioa');

    // Modales States
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isGastuModalOpen, setIsGastuModalOpen] = useState(false);
    
    // Estado para editar miembro
    const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Scroll Logic
    const [showArrows, setShowArrows] = useState(false); // Para Informazioa
    const [showArrowsBalantzea, setShowArrowsBalantzea] = useState(false); // Para Gastuak

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const balantzeaScrollRef = useRef<HTMLDivElement>(null);

    // --- LOGICA DE ZEREGINAK (TAREAS) ---
    const [bilaketaTerminoa, setBilaketaTerminoa] = useState('');
    const [dataHautatua, setDataHautatua] = useState<any>(new Date());

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const minDataString = getMinDateTime();

    // Forms
    const { data: memberData, setData: setMemberData, post: postMember, processing: processingMember, errors: memberErrors, reset: resetMember } = useForm({
        email: '',
    });

    const { data: taskData, setData: setTaskData, post: postTask, processing: processingTask, errors: taskErrors, reset: resetTask } = useForm({
        izenburua: '',
        muga_data: '',
        arduraduna_id: '',
        pisua_id: pisua.id
    });

    const { data: editFormData, setData: setEditFormData, put: putMember, processing: processingEdit, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        email: '',
    });

    useEffect(() => {
        if (pisua?.id) {
            setTaskData('pisua_id', pisua.id);
        }
    }, [pisua]);

    // --- HANDLERS ---
    const submitAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        postMember(`/pisua/${pisua.id}/add-member`, {
            onSuccess: () => { setIsMemberModalOpen(false); resetMember(); }
        });
    };

    const deleteMember = (userId: number) => {
        if (confirm("Ziur al zaude erabiltzaile hau pisutik bota nahi duzula?")) {
            router.delete(`/pisua/${pisua.id}/member/${userId}`);
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditFormData({
            name: user.name,
            email: user.email
        });
        setIsEditMemberModalOpen(true);
    };

    const submitEditMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        putMember(`/users/${editingUser.id}`, { 
            onSuccess: () => { 
                setIsEditMemberModalOpen(false); 
                setEditingUser(null);
                resetEdit(); 
            }
        });
    };

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
        if (confirm("Ziur al zaude zeregin hau ezabatu nahi duzula?")) {
            router.delete(`/zereginak/${id}`, { preserveScroll: true });
        }
    };

    const zereginakFiltratuak = zereginak.filter(z =>
        z.izenburua.toLowerCase().includes(bilaketaTerminoa.toLowerCase())
    );

    // --- UTILS SCROLL ---
    
    // 1. Scroll Informazioa (Usuarios)
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

    // 2. Scroll Gastuak (Balantzea)
    useEffect(() => {
        const checkScrollBalantzea = () => {
            if (balantzeaScrollRef.current) {
                const { scrollWidth, clientWidth } = balantzeaScrollRef.current;
                setShowArrowsBalantzea(scrollWidth > clientWidth);
            }
        };
        // Verificamos al cargar y al cambiar de tab
        if (activeTab === 'gastuak') {
            setTimeout(checkScrollBalantzea, 50);
        }
        window.addEventListener('resize', checkScrollBalantzea);
        return () => window.removeEventListener('resize', checkScrollBalantzea);
    }, [balantzea, activeTab]);

    const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
        if (ref.current) {
            const container = ref.current;
            const scrollAmount = 300;
            container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const getCardColor = (userId: number, index: number) => {
        if (userId === pisua.user_id) return 'bg-[#ff80bf]';
        const otherColors = ['bg-[#FFD700]', 'bg-[#FF9F43]', 'bg-[#3dcbe3]'];
        return otherColors[index % otherColors.length];
    };

    const formatuData = (dataString: string) => {
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? 'Data okerra' : data.toISOString().split('T')[0].replace(/-/g, '/');
    };

    const formatuOrdua = (dataString: string) => {
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? '--:--' : data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

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
                                style={{ backgroundColor: '#F97316' }}
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
            <Header/>
            <Head title={pisua.izena}>
                <title>{pisua.izena + " - Pisua"}</title>
                <meta name="description" content="Kudeatu zure pisua erraz." />
                {/* Facebook/WhatsApp-erako gainidatzi */}
                <meta property="og:title" content="Pisuak Zerrenda - Pisukideak" />
                <meta property="og:description" content="Hona hemen pisua." />
            </Head>

            <main className="flex-grow">
                <PisuaHeader pisua={pisua} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-[600px]">

                    {/* --- PESTAÑA INFORMACIÓN --- */}
                    {activeTab === 'informazioa' && (
                        <div className="animate-fade-in space-y-6">
                            <div className="bg-[#9EE4B8] rounded-xl p-6 md:p-8 relative shadow-sm">
                                {isAdmin && (
                                    <div className="md:absolute md:top-6 md:right-6 mb-6 md:mb-0">
                                        <Link href={`/pisua/${pisua.id}/edit`} className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-lg shadow-md transition font-medium w-full md:w-auto justify-center">
                                            <PenLine size={18} /> Editatu informazioa
                                        </Link>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="w-full mt-2">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">Deskripzioa</h2>
                                        <div className="bg-white/20 p-4 rounded-lg border border-white/30 backdrop-blur-sm w-full">
                                            <p className="text-gray-800 leading-relaxed font-medium">{pisua.deskripzioa || "Ez dago deskripziorik."}</p>
                                        </div>
                                    </div>

                                    {/* Carrusel Usuarios (INFORMACION) */}
                                    <div className="w-full relative group">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                            {isAdmin ? (
                                                <button onClick={() => setIsMemberModalOpen(true)} className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-5 py-2 rounded-lg shadow-md font-medium transition w-full md:w-auto justify-center">
                                                    <UserPlus size={20} /> Gehitu pisukidea
                                                </button>
                                            ) : <div />}
                                            
                                            {/* Flechas Scroll Informazioa */}
                                            {showArrows && (
                                                <div className="hidden md:flex gap-3">
                                                    <button onClick={() => scroll(scrollContainerRef, 'left')} className="p-2 rounded-full bg-[#6366f1] text-white"><ChevronLeft size={22} /></button>
                                                    <button onClick={() => scroll(scrollContainerRef, 'right')} className="p-2 rounded-full bg-[#6366f1] text-white"><ChevronRight size={22} /></button>
                                                </div>
                                            )}
                                        </div>
                                        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scroll-smooth no-scrollbar items-start">
                                            {pisua.users && pisua.users.map((user, index) => (
                                                <div key={user.id} className={`${getCardColor(user.id, index)} relative flex-shrink-0 w-36 h-36 md:w-44 md:h-44 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-between border border-black/5 hover:scale-105 transition-transform`}>
                                                    {user.id === pisua.user_id && <div className="absolute top-3 right-3 bg-black/10 p-1.5 rounded-full"><Crown size={16} /></div>}
                                                    
                                                    <div className="flex-grow flex items-center justify-center">
                                                        <span className="font-bold text-gray-900 text-base md:text-lg text-center break-words px-2">{user.name}</span>
                                                    </div>

                                                    {/* BOTONES DE ACCIÓN: SOLO SI ERES ADMIN Y NO ES TU PROPIA TARJETA */}
                                                    {isAdmin && user.id !== pisua.user_id && (
                                                        <div className="flex gap-3 mt-1 mb-1">
                                                            {/* Botón EDITAR */}
                                                            <button 
                                                                onClick={() => openEditModal(user)}
                                                                className="w-10 h-8 md:w-12 md:h-10 flex items-center justify-center bg-[#FFFF00] rounded-xl hover:bg-yellow-200 transition-colors shadow-md"
                                                                title="Editatu erabiltzailea"
                                                            >
                                                                <Edit size={18} color="black" strokeWidth={2.5} />
                                                            </button>

                                                            {/* Botón BORRAR */}
                                                            <button 
                                                                onClick={() => deleteMember(user.id)}
                                                                className="w-10 h-8 md:w-12 md:h-10 flex items-center justify-center bg-[#FF0000] rounded-xl hover:bg-red-600 transition-colors shadow-md"
                                                                title="Kanporatu erabiltzailea"
                                                            >
                                                                <Trash2 size={18} color="black" strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#C4CDD5] p-6 md:p-8 rounded-xl shadow-sm h-40 md:h-48 flex flex-col justify-center">
                                    <h3 className="text-xl md:text-2xl text-gray-800 font-bold mb-2">Zereginak</h3>
                                    <span className="text-3xl md:text-4xl font-normal text-gray-900">{zereginak.length}</span>
                                    <span className="text-gray-600 mt-1">{zereginak.filter(z => !z.eginda).length} zain</span>
                                </div>
                                <div className="bg-[#C4CDD5] p-6 md:p-8 rounded-xl shadow-sm h-40 md:h-48 flex flex-col justify-center">
                                    <h3 className="text-xl md:text-2xl text-gray-800 font-bold mb-2">Gastuak</h3>
                                    <span className="text-3xl md:text-4xl font-normal text-gray-900">
                                        {gastuak.reduce((acc, curr) => acc + Number(curr.zenbatekoa), 0).toFixed(2)}€
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PESTAÑA ZEREGINAK --- */}
                    {activeTab === 'zereginak' && (
                        <div className="animate-fade-in space-y-8 md:space-y-12">
                            <div className="bg-[#8da2c0] rounded-xl shadow-lg p-0 flex flex-col">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 gap-4">
                                    <h2 className="text-lg font-medium text-gray-900">Zereginen zerrenda</h2>
                                    <div className="relative w-full sm:w-auto">
                                        <input
                                            type="text"
                                            placeholder="Bilatu..."
                                            className="w-full sm:w-50 pl-4 pr-10 py-1 rounded-full bg-white border-none text-sm focus:ring-2 focus:ring-indigo-400"
                                            value={bilaketaTerminoa}
                                            onChange={(e) => setBilaketaTerminoa(e.target.value)}
                                        />
                                        <Search className="w-4 h-4 absolute right-3 top-1.5 text-gray-500" />
                                    </div>
                                </div>

                                <div className="px-3 space-y-2 flex-grow">
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
                                                <div key={zeregina.id} className="bg-[#dee5f0] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm transition-all hover:shadow-md gap-4">
                                                    <div className="flex items-center gap-4 flex-grow overflow-hidden">
                                                        <input
                                                            type="checkbox"
                                                            checked={zeregina.eginda}
                                                            onChange={() => toggleZeregina(zeregina)}
                                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                                                        />
                                                        <button onClick={() => deleteZeregina(zeregina.id)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-bold uppercase px-2 py-1 md:px-3 md:py-1.5 rounded transition flex-shrink-0">
                                                            Ezabatu
                                                        </button>

                                                        <span className={`${testuEstiloa} text-sm md:text-base break-words whitespace-normal max-w-[150px] sm:max-w-[300px] md:max-w-[400px] block`}>
                                                            {zeregina.izenburua}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 pt-2 md:pt-0 flex-shrink-0">
                                                        <div className={`text-xs md:text-sm font-mono flex gap-2 md:gap-4 ${dataEstiloa}`}>
                                                            <span>{formatuData(zeregina.muga_data)}</span>
                                                            <span>{formatuOrdua(zeregina.muga_data)}</span>
                                                        </div>

                                                        {zeregina.arduraduna ? (
                                                            <span
                                                                className="px-3 py-1 md:px-4 md:py-1 rounded-full text-[11px] md:text-sm font-semibold text-gray-800 shadow-sm border border-white/20"
                                                                style={{ backgroundColor: lortuKolorea(zeregina.arduraduna.id) }}
                                                            >
                                                                {zeregina.arduraduna.name}
                                                            </span>
                                                        ) : (
                                                            <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs">?</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="p-5 flex justify-center md:justify-end mt-2">
                                    <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#6366f1] text-white px-6 md:px-8 py-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition w-full md:w-auto">
                                        <PlusCircle className="w-5 h-5" />
                                        <span className="font-semibold text-sm">Zeregin berria</span>
                                    </button>
                                </div>
                            </div>

                            <div className="max-w-3xl mx-auto p-4 md:p-6 flex justify-center calendar-container text-lg bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

                    {/* --- PESTAÑA GASTUAK --- */}
                    {activeTab === 'gastuak' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex justify-end items-center">
                                <button
                                    onClick={() => setIsGastuModalOpen(true)}
                                    className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-2.5 rounded-full shadow-lg transition-all font-semibold text-base"
                                >
                                    <PlusCircle size={20} />
                                    Gastu berria
                                </button>
                            </div>

                            {/* --- SECCIÓN BALANTZEA (Scroll Suave) --- */}
                            <div className="bg-[#B0B8C9] p-6 rounded-[30px] shadow-sm relative group">
                                
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <h3 className="text-xl font-bold text-gray-800 ml-2">
                                        Balantzea
                                    </h3>
                                    
                                    {/* Flechas de Scroll */}
                                    {showArrowsBalantzea && (
                                        <div className="flex gap-3">
                                            <button onClick={() => scroll(balantzeaScrollRef, 'left')} className="p-2 rounded-full bg-white text-[#6366f1] shadow-md hover:bg-gray-50"><ChevronLeft size={22} /></button>
                                            <button onClick={() => scroll(balantzeaScrollRef, 'right')} className="p-2 rounded-full bg-white text-[#6366f1] shadow-md hover:bg-gray-50"><ChevronRight size={22} /></button>
                                        </div>
                                    )}
                                </div>

                                {/* Contenedor con Scroll: Aseguramos scroll-smooth */}
                                <div ref={balantzeaScrollRef} className="flex overflow-x-auto gap-4 pb-2 scroll-smooth custom-scrollbar px-2">
                                    {balantzea.map((userBalance, index) => {
                                        const userIndex = pisua.users?.findIndex(u => u.id === userBalance.id) ?? index;
                                        const bgColor = getCardColor(userBalance.id, userIndex);

                                        return (
                                            <div key={userBalance.id} className={`${bgColor} w-56 h-56 rounded-[30px] p-6 flex flex-col items-center justify-center shadow-md shrink-0 transition-transform hover:scale-105`}>
                                                <div className="text-lg font-semibold text-gray-800 mb-2 truncate max-w-full text-center">{userBalance.name}</div>
                                                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                                                    {userBalance.saldo > 0 ? '+' : ''}{userBalance.saldo.toFixed(2)}€
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {balantzea.length === 0 && <p className="text-gray-600 text-base text-center w-full py-8">Ez dago daturik.</p>}
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {gastuak.length === 0 ? (
                                        <div className="bg-[#D0D3F7] p-8 rounded-[20px] text-center text-gray-600">Oraindik ez dago gasturik.</div>
                                    ) : (
                                        gastuak.map(gastu => {
                                            const payerColor = ['bg-[#FFF34F]', 'bg-[#FFB347]'][gastu.ordaintzailea.id % 2];
                                            return (
                                                <div key={gastu.id} className="bg-[#D0D3F7] p-4 rounded-[25px] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-3 min-w-0 pl-4">
                                                        <p className="text-lg font-bold text-gray-800 truncate" title={gastu.konzeptua}>
                                                            {gastu.konzeptua}
                                                        </p>
                                                        <span className={`${payerColor} px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm whitespace-nowrap`}>
                                                            {gastu.ordaintzailea.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 pl-2">
                                                        <span className="text-2xl font-bold text-gray-900 whitespace-nowrap">{gastu.zenbatekoa}€</span>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Ziur zaude gastu hau ezabatu nahi duzula?')) {
                                                                    router.delete(`/gastuak/${gastu.id}`);
                                                                }
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-white/50 rounded-full transition-colors"
                                                            title="Ezabatu gastua"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
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

            {/* --- MODAL EDITAR MIEMBRO (Nombre bloqueado) --- */}
            {isEditMemberModalOpen && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Editatu erabiltzailea</h3>
                            <button onClick={() => { setIsEditMemberModalOpen(false); setEditingUser(null); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={submitEditMember} className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Izena</label>
                                <input 
                                    type="text" 
                                    value={editFormData.name} 
                                    disabled={true} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
                                />
                                <p className="text-xs text-gray-400 mt-1">Izena ezin da aldatu.</p>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Emaila</label>
                                <input 
                                    type="email" 
                                    value={editFormData.email} 
                                    onChange={e => setEditFormData('email', e.target.value)} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                                    required 
                                />
                                {editErrors.email && <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>}
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => { setIsEditMemberModalOpen(false); setEditingUser(null); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold">Utzi</button>
                                <button type="submit" disabled={processingEdit} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold shadow-sm">
                                    {processingEdit ? 'Gordetzen...' : 'Gorde aldaketak'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL AÑADIR TAREA --- */}
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

            {/* --- MODAL AÑADIR GASTO --- */}
            <GastuModal
                isOpen={isGastuModalOpen}
                onClose={() => setIsGastuModalOpen(false)}
                pisua={pisua}
                pisuaId={pisua.id}
                users={pisua.users || []}
                authUser={auth.user}
            />

            <Footer />
        </div>
    );
}