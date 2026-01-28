import React, { useState, FormEvent } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Search, PlusCircle, X, User as UserIcon, Clock } from 'lucide-react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import '../../../css/calendar-custom.css'; 

// --- INTERFAZEAK ---
interface Erabiltzailea {
    id: number;
    name: string;
}

interface Zeregina {
    id: number;
    izenburua: string;
    eginda: boolean;
    muga_data: string;
    arduraduna_id: number;
    arduraduna?: Erabiltzailea;
}

interface Props {
    zereginak: Zeregina[];
    erabiltzaileak: Erabiltzailea[];
    filters: {
        bilaketa?: string;
    };
}

// --- KOLOREEN LOGIKA ---
const KOLOREAK = [
    '#FFadad', // Gorri argia
    '#ffd6a5', // Laranja argia
    '#fdffb6', // Hori argia
    '#caffbf', // Berde argia
    '#9bf6ff', // Zian argia
    '#a0c4ff', // Urdin argia
    '#bdb2ff', // More argia
    '#ffc6ff', // Arrosa argia
];

const lortuKolorea = (id: number) => {
    return KOLOREAK[id % KOLOREAK.length];
};

export default function Index({ zereginak, erabiltzaileak, filters }: Props) {
    const [bilaketaTerminoa, setBilaketaTerminoa] = useState(filters.bilaketa || '');
    const [modalaIrekita, setModalaIrekita] = useState(false);
    const [dataHautatua, setDataHautatua] = useState<any>(new Date());

    // Data minimoa kalkulatu
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    
    const minDataString = getMinDateTime();

    const { data, setData, post, processing, reset, errors } = useForm({
        izenburua: '',
        muga_data: '',
        arduraduna_id: '' 
    });

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value; 
        if (!inputVal) {
            setData('muga_data', '');
            return;
        }
        const selectedDate = new Date(inputVal);
        const now = new Date();
        now.setSeconds(0, 0);

        if (selectedDate < now) {
            alert("Ezin duzu iraganeko data edo ordu bat aukeratu.");
            setData('muga_data', minDataString); 
        } else {
            setData('muga_data', inputVal);
        }
    };

    // --- FUNTZIOAK ---
    const bilatu = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get('/zereginak', { bilaketa: bilaketaTerminoa }, {
                preserveState: true,
                replace: true,
            });
        }
    };

    const egoeraAldatu = (zeregina: Zeregina) => {
        router.put(`/zereginak/${zeregina.id}`, {
            eginda: !zeregina.eginda
        }, { preserveScroll: true });
    };

    const zereginaEzabatu = (id: number) => {
        if (confirm('Ziur al zaude zeregin hau ezabatu nahi duzula?')) {
            router.delete(`/zereginak/${id}`, { preserveScroll: true });
        }
    };

    const zereginaGorde = (e: FormEvent) => {
        e.preventDefault();
        post('/zereginak', {
            onSuccess: () => {
                setModalaIrekita(false);
                reset();
            }
        });
    };

    // --- FORMATUAK ---
    const formatuData = (dataString: string) => {
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? 'Data okerra' : data.toISOString().split('T')[0].replace(/-/g, '/');
    };

    const formatuOrdua = (dataString: string) => {
        const data = new Date(dataString);
        return isNaN(data.getTime()) ? '--:--' : data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Egutegiko edukia
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
        <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
            <Head title="Zereginak" />
            <Header />

            <main className="flex-grow">
                {/* HERO */}
                <div className="relative h-72 w-full overflow-hidden">
                    <img src="/images/living-room-bg.jpg" alt="Pisua" className="w-full h-full object-cover" />
                    <div className="absolute top-1/2 left-12 -translate-y-1/2 text-black">
                        <h1 className="text-5xl font-normal tracking-tight">PISUA 1</h1>
                        <p className="text-xl font-light">Ibargarai 19, Bergara</p>
                    </div>
                </div>

                {/* TABS */}
                <div className="max-w-4xl mx-auto -mt-6 relative z-10 px-4">
                    <div className="bg-[#cbd5e1] rounded-full flex overflow-hidden shadow-sm border border-gray-300">
                        <button className="flex-1 py-3 hover:bg-gray-200 transition border-r border-gray-400">Informazioa</button>
                        <button className="flex-1 py-3 bg-[#b9c5d6] font-semibold border-r border-gray-400">Zereginak</button>
                        <button className="flex-1 py-3 hover:bg-gray-200 transition">Gastuak</button>
                    </div>
                </div>

                {/* ZEREGINEN LISTA */}
                <div className="max-w-4xl mx-auto mt-10 px-4">
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
                                    onKeyDown={bilatu}
                                />
                                <Search className="w-4 h-4 absolute right-3 top-1.5 text-gray-500" />
                            </div>
                        </div>

                        <div className="px-3 space-y-2">
                            {zereginak.length === 0 ? (
                                <div className="bg-white/80 rounded-lg p-10 text-center">
                                    <p className="text-gray-600">Ez dago zereginik momentuz.</p>
                                </div>
                            ) : (
                                zereginak.map((zeregina) => {
                                    // Kontrola: epea pasatu da?
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
                                        <div key={zeregina.id} className="bg-[#dee5f0] rounded-lg p-4 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="checkbox"
                                                    checked={zeregina.eginda}
                                                    onChange={() => egoeraAldatu(zeregina)}
                                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                />
                                                <button onClick={() => zereginaEzabatu(zeregina.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded transition">
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

                        <div className="absolute -bottom-6 right-8 flex flex-col items-center">
                            <button onClick={() => setModalaIrekita(true)} className="flex items-center gap-2 bg-[#6366f1] text-white px-8 py-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition">
                                <PlusCircle className="w-5 h-5" />
                                <span className="font-semibold text-sm">Zeregin berria</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* EGUTEGIA HANDIAGOA */}
                {/* ALDAKETA: max-w-md -> max-w-3xl eta text-lg */}
                <div className="max-w-3xl mx-auto mt-16 mb-20 p-6 flex justify-center calendar-container text-lg">
                   <Calendar 
                        onChange={setDataHautatua} 
                        value={dataHautatua}
                        locale="eu-ES" 
                        tileContent={tileContent} 
                    />
                </div>
            </main>

            <Footer />

            {/* MODALA */}
            {modalaIrekita && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-center items-center p-5 border-b relative">
                            <h3 className="text-xl font-bold tracking-wide">ZEREGIN BERRIA</h3>
                            <button onClick={() => setModalaIrekita(false)} className="absolute right-5 text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={zereginaGorde} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Kontzeptua</label>
                                <input 
                                    type="text" 
                                    value={data.izenburua} 
                                    onChange={e => {
                                        setData('izenburua', e.target.value);
                                        e.target.setCustomValidity(''); 
                                    }}
                                    onInvalid={e => e.currentTarget.setCustomValidity('Mesedez, bete eremu hau.')}
                                    className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 py-2 bg-gray-50" 
                                    required 
                                    placeholder="Adib: Zaborra bota" 
                                />
                                {errors.izenburua && <div className="text-red-500 text-xs mt-1">{errors.izenburua}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Nork</label>
                                <div className="relative">
                                    <select
                                        value={data.arduraduna_id}
                                        onChange={e => {
                                            setData('arduraduna_id', e.target.value);
                                            e.target.setCustomValidity('');
                                        }}
                                        onInvalid={e => e.currentTarget.setCustomValidity('Mesedez, arduradun bat aukeratu.')}
                                        className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 py-2 pl-3 pr-10 appearance-none bg-gray-50"
                                        required
                                    >
                                        <option value="" disabled>Aukeratu pisukidea...</option>
                                        {erabiltzaileak.map((erabiltzailea) => (
                                            <option key={erabiltzailea.id} value={erabiltzailea.id}>
                                                {erabiltzailea.name}
                                            </option>
                                        ))}
                                    </select>
                                    <UserIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.arduraduna_id && <div className="text-red-500 text-xs mt-1">{errors.arduraduna_id}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Noiz eta Ordua</label>
                                <div className="relative">
                                    <input 
                                        type="datetime-local" 
                                        value={data.muga_data} 
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
                                {errors.muga_data && <div className="text-red-500 text-xs mt-1">{errors.muga_data}</div>}
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={processing} className="w-full py-3 bg-[#8da2c0] hover:bg-[#7b8ea8] text-white rounded-lg font-bold text-lg shadow-md transition">
                                    {processing ? 'Gordetzen...' : 'Gehitu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}