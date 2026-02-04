import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { Trash2, Search, Calendar as CalendarIcon, ArrowRight, CheckCircle, Circle, Clock } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// --- ESTILOS CALENDARIO (Adaptados al diseño de tarjeta flotante) ---
const customStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  /* Contenedor del calendario estilo tarjeta blanca flotante */
  .react-calendar { 
    border: none; 
    width: 100%; 
    font-family: inherit; 
    background: white; 
    padding: 20px; 
    border-radius: 30px; 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .react-calendar__tile { height: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-weight: 500; font-size: 14px; }
  /* Día seleccionado (Rosa/Rojo intenso) */
  .react-calendar__tile--active { background: #fca5a5 !important; color: white; border-radius: 50%; width: 40px !important; height: 40px !important; margin: 0 auto; }
  /* Día actual (Azul claro) */
  .react-calendar__tile--now { background: #e0e7ff; color: #4338ca; border-radius: 50%; width: 40px !important; height: 40px !important; margin: 0 auto; }
  .react-calendar__navigation button { font-size: 18px; font-weight: bold; color: #374151; }
  .react-calendar__month-view__days__day--neighboringMonth { color: #d1d5db !important; }
  abbr[title] { text-decoration: none !important; }
`;

// --- INTERFACES ---
interface User {
    id: number;
    name: string;
}

interface Pisua {
    id: number;
    izena: string;
}

interface Zeregina {
    id: number;
    izenburua: string;
    eginda: boolean;
    muga_data: string;
    pisua_id: number;
    pisua: Pisua;
    arduraduna?: User;
}

interface DashboardProps {
    zereginak: Zeregina[];
}

export default function Dashboard({ zereginak }: DashboardProps) {
    const [date, setDate] = useState<any>(new Date());
    const [filterByDate, setFilterByDate] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- LOGICA (Sin cambios funcionales) ---

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

    const handleDateClick = (value: any) => {
        setDate(value);
        setFilterByDate(true);
    };

    const resetFilter = () => {
        setDate(new Date());
        setFilterByDate(false);
        setSearchTerm('');
    };

    // Filtrado combinado (Fecha + Búsqueda)
    const tareasFiltradas = zereginak.filter(z => {
        // Filtro de búsqueda de texto
        if (searchTerm && !z.izenburua.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        // Filtro de fecha (si está activo el calendario)
        if (filterByDate) {
            const zDate = new Date(z.muga_data);
            return (
                zDate.getDate() === date.getDate() &&
                zDate.getMonth() === date.getMonth() &&
                zDate.getFullYear() === date.getFullYear()
            );
        }
        return true;
    });

    // Ordenar: Primero pendientes, luego por fecha
    const tareasOrdenadas = [...tareasFiltradas].sort((a, b) => {
        if (a.eginda === b.eginda) {
            return new Date(a.muga_data).getTime() - new Date(b.muga_data).getTime();
        }
        return a.eginda ? 1 : -1;
    });

    // Formateadores para igualar el estilo de la imagen (YYYY/MM/DD)
    const formatDateImageStyle = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
            <style>{customStyles}</style>
            <Head title="Nire Panela" />
            <Header />

            <main className="flex-grow max-w-6xl mx-auto w-full p-6 lg:p-10">
                
                {/* Título principal */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Arbela Nagusia</h1>
                    <p className="text-gray-500 mt-1">Zure pisu guztietako zereginen ikuspegi orokorra.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* --- COLUMNA IZQUIERDA: LISTA DE TAREAS (Estilo Imagen) --- */}
                    <div className="w-full lg:w-2/3 z-10">
                        
                        {/* HEADER GRIS TIPO "BARRA SUPERIOR" */}
                        <div className="bg-[#e5e7eb] rounded-t-xl p-4 flex justify-between items-center shadow-sm relative z-20">
                            <h2 className="text-xl font-medium text-gray-800 ml-2">
                                {filterByDate ? `Zereginak (${date.toLocaleDateString()})` : 'Zereginak'}
                            </h2>
                            
                            <div className="flex items-center gap-4">
                                {/* Botón Reset Filtro (si aplica) */}
                                {filterByDate && (
                                    <button onClick={resetFilter} className="text-xs text-indigo-600 hover:underline font-medium">
                                        Ikusi denak
                                    </button>
                                )}
                                {/* Buscador */}
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Bilatu..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-4 pr-10 py-1.5 rounded-lg border-none shadow-sm text-sm focus:ring-2 focus:ring-indigo-300 w-48 bg-white"
                                    />
                                    <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2" />
                                </div>
                            </div>
                        </div>

                        {/* CONTENEDOR LISTA DE TAREAS */}
                        <div className="bg-gray-50/80 p-4 rounded-b-xl -mt-2 pt-6 space-y-3 min-h-[400px] relative z-10">
                            {tareasOrdenadas.length === 0 ? (
                                <div className="text-center text-gray-500 py-10 flex flex-col items-center justify-center bg-white/50 rounded-xl mt-4">
                                    <CheckCircle className="w-12 h-12 text-gray-300 mb-2" />
                                    <p>Ez dago zereginik irizpide hauekin.</p>
                                </div>
                            ) : (
                                tareasOrdenadas.map((zeregina) => {
                                    const mugaData = new Date(zeregina.muga_data);
                                    const isLate = !zeregina.eginda && mugaData < new Date();
                                    
                                    return (
                                        <div 
                                            key={zeregina.id}
                                            // COLOR DE FONDO EXACTO DE LA IMAGEN (Gris azulado: #dce1ec)
                                            className={`relative flex items-center justify-between p-4 rounded-xl shadow-sm transition-all group ${
                                                zeregina.eginda ? 'bg-gray-200 opacity-60' : 'bg-[#dce1ec] hover:shadow-md'
                                            }`}
                                        >
                                            {/* Izquierda: Checkbox + Icono Borrar + Titulo */}
                                            <div className="flex items-center gap-4">
                                                {/* Checkbox personalizado */}
                                                <button 
                                                    onClick={() => toggleZeregina(zeregina)}
                                                    className={`flex-shrink-0 transition-colors ${zeregina.eginda ? 'text-green-600' : 'text-gray-400 hover:text-indigo-600'}`}
                                                >
                                                    {zeregina.eginda ? <CheckCircle size={22} weight="fill" /> : <Circle size={22} />}
                                                </button>
                                                
                                                {/* Botón Borrar (Icono Trash) */}
                                                <button 
                                                    onClick={() => deleteZeregina(zeregina.id)}
                                                    className="text-gray-600 hover:text-red-600 transition-colors p-1 hover:bg-black/5 rounded-full"
                                                    title="Ezabatu zeregina"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <span className={`font-medium text-gray-800 text-base truncate ${zeregina.eginda ? 'line-through' : ''} ${isLate ? 'text-red-700' : ''}`}>
                                                    {zeregina.izenburua}
                                                </span>
                                            </div>

                                            {/* Derecha: Datos + Etiquetas Apiladas */}
                                            <div className="flex items-center gap-6 pl-4">
                                                
                                                {/* Fecha y Hora (Fuente monoespaciada para alinear) */}
                                                <div className={`hidden md:flex items-center gap-3 text-sm font-medium font-mono ${isLate ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                                    <span>{formatDateImageStyle(zeregina.muga_data)}</span>
                                                    <span>{formatTime(zeregina.muga_data)}</span>
                                                </div>

                                                {/* Etiquetas (Pills) apiladas verticalmente */}
                                                <div className="flex flex-col gap-1 items-end shrink-0">
                                                    {/* Etiqueta PISO (Verde pastel) */}
                                                    <Link 
                                                        href={`/pisua/${zeregina.pisua.id}`}
                                                        className="group/link flex items-center gap-1 bg-[#86efac] text-green-900 text-[10px] font-bold px-3 py-0.5 rounded-full hover:bg-green-300 transition shadow-sm w-fit text-center whitespace-nowrap"
                                                    >
                                                        {zeregina.pisua.izena}
                                                        <ArrowRight size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                    </Link>

                                                    {/* Etiqueta USUARIO (Rosa/Azul pastel) */}
                                                    {/* Si el backend no envía 'arduraduna', muestra 'Denok' */}
                                                    <span className="bg-[#c4b5fd] text-indigo-900 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm w-fit text-center whitespace-nowrap truncate max-w-[80px]">
                                                        {zeregina.arduraduna ? zeregina.arduraduna.name : 'Denok'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* --- COLUMNA DERECHA: CALENDARIO FLOTANTE --- */}
                    <div className="w-full lg:w-1/3 flex justify-center lg:justify-end lg:sticky lg:top-6">
                        <div className="w-full max-w-sm relative">
                             {/* Decoración de fondo para el calendario */}
                            <div className="absolute inset-0 bg-indigo-50 rounded-[35px] rotate-3 transform shadow-sm -z-10"></div>
                            <Calendar
                                onChange={handleDateClick}
                                value={date}
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