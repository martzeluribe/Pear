import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { Search, ArrowRight } from 'lucide-react'; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// --- ESTILOS CALENDARIO ---
const customStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .react-calendar { 
    border: none; width: 100%; font-family: inherit; background: white; 
    padding: 20px; border-radius: 24px; 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .react-calendar__tile { 
    height: 60px; display: flex; flex-direction: column; justify-content: flex-start; 
    align-items: center; font-weight: 500; font-size: 14px; padding-top: 10px !important;
  }
  .react-calendar__tile--active { background: #6366f1 !important; color: white; border-radius: 12px; }
  .react-calendar__tile--now { background: #e0e7ff; color: #4338ca; border-radius: 12px; }
  .react-calendar__navigation button { font-size: 18px; font-weight: bold; color: #374151; }
  .react-calendar__month-view__days__day--neighboringMonth { color: #d1d5db !important; }
  abbr[title] { text-decoration: none !important; }
`;

// --- INTERFACES ---
interface User { id: number; name: string; }
interface Pisua { id: number; izena: string; }
interface Zeregina {
    id: number; izenburua: string; eginda: boolean; muga_data: string;
    pisua_id: number; pisua: Pisua; arduraduna?: User;
}
interface DashboardProps { zereginak: Zeregina[]; }

// Colores para las etiquetas de usuario
const KOLOREAK = ['#FFadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
const lortuKolorea = (id: number) => KOLOREAK[id % KOLOREAK.length];

export default function Dashboard({ zereginak }: DashboardProps) {
    const [date, setDate] = useState<any>(new Date());
    const [filterByDate, setFilterByDate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleZeregina = (zeregina: Zeregina) => {
        router.put(`/zereginak/${zeregina.id}`, { eginda: !zeregina.eginda }, { preserveScroll: true });
    };

    const deleteZeregina = (id: number) => {
        if (confirm("Ziur al zaude zeregin hau ezabatu nahi duzula?")) {
            router.delete(`/zereginak/${id}`, { preserveScroll: true });
        }
    };

    const handleDateClick = (value: any) => { setDate(value); setFilterByDate(true); };
    const resetFilter = () => { setDate(new Date()); setFilterByDate(false); setSearchTerm(''); };

    const tareasFiltradas = zereginak.filter(z => {
        if (searchTerm && !z.izenburua.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (filterByDate) {
            const zDate = new Date(z.muga_data);
            return zDate.getDate() === date.getDate() && zDate.getMonth() === date.getMonth() && zDate.getFullYear() === date.getFullYear();
        }
        return true;
    });

    const tareasOrdenadas = [...tareasFiltradas].sort((a, b) => {
        if (a.eginda === b.eginda) return new Date(a.muga_data).getTime() - new Date(b.muga_data).getTime();
        return a.eginda ? 1 : -1;
    });

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    };
    const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const hasTask = zereginak.some(z => {
                const zDate = new Date(z.muga_data);
                return zDate.getDate() === date.getDate() && zDate.getMonth() === date.getMonth() && zDate.getFullYear() === date.getFullYear() && !z.eginda;
            });
            if (hasTask) return <div className="mt-1"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full mx-auto"></div></div>;
        }
        return null;
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
            <style>{customStyles}</style>
            <Head title="Nire Laburpena">
                <title>Nire Laburpena - pisukideak</title>
                <meta name="description" content="Kudeatu Laburpena erraz." />
                {/* Facebook/WhatsApp-erako gainidatzi */}
                <meta property="og:title" content="Pisuen Laburpena - Pisukideak" />
                <meta property="og:description" content="Kudeatu Laburpena." />
            </Head>
            <Header />

            <main className="flex-grow max-w-7xl mx-auto w-full p-4 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Arbela Nagusia</h1>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
                    
                    {/* --- LISTA DE TAREAS --- */}
                    <div className="w-full lg:w-2/3 z-10">
                        <div className="bg-[#8da2c0] rounded-xl shadow-lg p-0 pb-6 relative">
                            
                            {/* Header simple */}
                            <div className="flex justify-between items-center p-5">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {filterByDate ? `Zereginak (${date.toLocaleDateString()})` : 'Zereginen zerrenda'}
                                    {filterByDate && <button onClick={resetFilter} className="ml-2 text-xs text-white bg-black/20 px-2 py-0.5 rounded hover:bg-black/30">Egun guztiak ikusi</button>}
                                </h2>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Bilatu..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-40 pl-4 pr-10 py-1 rounded-full bg-white border-none text-sm focus:ring-2 focus:ring-indigo-400" 
                                    />
                                    <Search className="w-4 h-4 absolute right-3 top-1.5 text-gray-500" />
                                </div>
                            </div>

                            {/* Lista de Items */}
                            <div className="px-3 space-y-2 min-h-[400px]">
                                {tareasOrdenadas.length === 0 ? (
                                    <div className="bg-white/80 rounded-lg p-10 text-center">
                                        <p className="text-gray-600">Ez dago zereginik irizpide hauekin.</p>
                                    </div>
                                ) : (
                                    tareasOrdenadas.map((zeregina) => {
                                        const mugaData = new Date(zeregina.muga_data);
                                        const isLate = !zeregina.eginda && mugaData < new Date();
                                        
                                        const testuEstiloa = zeregina.eginda ? 'line-through opacity-50 text-gray-500 font-medium' : isLate ? 'text-red-600 font-bold' : 'text-gray-900 font-medium';
                                        const dataEstiloa = !zeregina.eginda && isLate ? 'text-red-600 font-bold' : 'text-gray-700';

                                        return (
                                            <div key={zeregina.id} className="bg-[#dee5f0] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm transition-all hover:shadow-md gap-3 sm:gap-0">
                                                
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={zeregina.eginda} 
                                                        onChange={() => toggleZeregina(zeregina)} 
                                                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0" 
                                                    />
                                                    
                                                    <button 
                                                        onClick={() => deleteZeregina(zeregina.id)} 
                                                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded transition flex-shrink-0"
                                                    > 
                                                        Ezabatu 
                                                    </button>
                                                    
                                                    {/* --- MODIFICACIÓN AQUÍ: max-w y block --- */}
                                                    <span className={`${testuEstiloa} break-words max-w-[150px] sm:max-w-xs md:max-w-sm block`}> 
                                                        {zeregina.izenburua} 
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-6 pl-0 sm:pl-4 w-full sm:w-auto justify-between sm:justify-end">
                                                    <div className={`text-sm font-mono flex gap-4 ${dataEstiloa}`}>
                                                        <span>{formatDate(zeregina.muga_data)}</span>
                                                        <span className="hidden sm:inline">{formatTime(zeregina.muga_data)}</span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-1 items-end shrink-0">
                                                        <Link 
                                                            href={`/pisua/${zeregina.pisua.id}`}
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded text-gray-600 bg-white/50 hover:bg-white flex items-center gap-1"
                                                        >
                                                            {zeregina.pisua.izena} <ArrowRight size={8}/>
                                                        </Link>

                                                        {zeregina.arduraduna && (
                                                            <span 
                                                                className="px-4 py-1 rounded-full text-xs font-bold text-gray-800 border border-black/10 shadow-sm whitespace-nowrap" 
                                                                style={{ backgroundColor: lortuKolorea(zeregina.arduraduna.id) }}
                                                            >
                                                                {zeregina.arduraduna.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- CALENDARIO FLOTANTE --- */}
                    <div className="w-full lg:w-1/3 flex justify-center lg:justify-end lg:sticky lg:top-6">
                        <div className="w-full max-w-sm relative">
                            <div className="absolute inset-0 bg-indigo-100 rounded-[35px] rotate-3 transform shadow-sm -z-10"></div>
                            <Calendar
                                onChange={handleDateClick}
                                value={date}
                                tileContent={tileContent}
                                locale="eu-ES"
                                className="font-sans"
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}