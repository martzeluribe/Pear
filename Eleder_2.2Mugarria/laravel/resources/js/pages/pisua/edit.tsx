import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/Components/Footer'; // Asegúrate de que la ruta sea correcta (mayúsculas/minúsculas)
import { Plus, Save, ArrowLeft } from 'lucide-react';

interface Pisua {
    id: number;
    izena: string;
    deskripzioa?: string;
    helbidea?: string;
    kodigoa: string;
    imagen_path?: string;
}

interface EditProps {
    pisua: Pisua;
}

export default function Edit({ pisua }: EditProps) {
    const [preview, setPreview] = useState<string | null>(
        pisua.imagen_path ? `/storage/${pisua.imagen_path}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        izena: pisua.izena || '',
        deskripzioa: pisua.deskripzioa || '',
        helbidea: pisua.helbidea || '',
        imagen: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pisua/${pisua.id}`);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('imagen', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Función para volver atrás en el historial
    const handleBack = () => {
        window.history.back();
    };

    // --- ESTILOS VISUALES ---
    const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-700 placeholder-gray-400 transition-all";
    const labelClass = "block text-gray-700 text-sm font-medium mb-1";

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Head title="Editatu Pisua" />

            <main className="flex-grow flex items-center justify-center bg-gray-50 p-6">
                
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-blue-400 p-8">
                    
                    <h1 className="text-xl font-normal text-center mb-6 text-gray-700 uppercase tracking-wide">
                        EDITATU PISUA
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* 1. IZENA */}
                        <div>
                            <label htmlFor="izena" className={labelClass}>Izena</label>
                            <input
                                id="izena"
                                type="text"
                                value={data.izena}
                                onChange={(e) => setData('izena', e.target.value)}
                                className={inputClass}
                            />
                            {errors.izena && <p className="text-red-500 text-xs mt-1">{errors.izena}</p>}
                        </div>

                        {/* 2. DESKRIPZIOA */}
                        <div>
                            <label htmlFor="deskripzioa" className={labelClass}>Deskripzioa</label>
                            <textarea
                                id="deskripzioa"
                                value={data.deskripzioa}
                                onChange={(e) => setData('deskripzioa', e.target.value)}
                                className={`${inputClass} h-24 resize-none`}
                            />
                            {errors.deskripzioa && <p className="text-red-500 text-xs mt-1">{errors.deskripzioa}</p>}
                        </div>

                        {/* 3. HELBIDEA */}
                        <div>
                            <label htmlFor="helbidea" className={labelClass}>Helbidea</label>
                            <input
                                id="helbidea"
                                type="text"
                                value={data.helbidea}
                                onChange={(e) => setData('helbidea', e.target.value)}
                                className={inputClass}
                            />
                            {errors.helbidea && <p className="text-red-500 text-xs mt-1">{errors.helbidea}</p>}
                        </div>

                        {/* 4. ARGAZKIA */}
                        <div>
                            <label className={labelClass}>Argazkia</label>
                            
                            {preview && (
                                <div className="mb-3 relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={preview} alt="Aurreikuspena" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <label className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-lg border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50 text-gray-500 transition-colors">
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">
                                    {data.imagen ? 'Argazkia aldatu' : 'Gehitu argazkia'}
                                </span>
                                <input
                                    type="file"
                                    id="imagen"
                                    name="imagen"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden" 
                                />
                            </label>
                            {errors.imagen && <p className="text-red-500 text-xs mt-1">{errors.imagen}</p>}
                        </div>

                        {/* BOTONES DE ACCIÓN */}
                        <div className="flex items-center justify-between gap-4 pt-4 mt-6">
                            
                            {/* BOTÓN UTZI - CAMBIADO A BACK */}
                            <button 
                                type="button" // IMPORTANTE: type="button" para no enviar form
                                onClick={handleBack}
                                className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-xl shadow-sm text-center transition-colors flex justify-center items-center gap-2"
                            >
                                <ArrowLeft size={18}/> Utzi
                            </button>

                            {/* BOTÓN GORDE */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-1/2 bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Gordetzen...' : 'Gorde'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}