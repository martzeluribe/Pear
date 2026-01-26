import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';
import { Plus, Save, ArrowLeft } from 'lucide-react';

export default function Sortu() {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        deskripzioa: '',
        helbidea: '',
        imagen: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pisua'); 
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('imagen', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Estilos basados en tu captura de imagen (image_e3f981.png)
    const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-700 placeholder-gray-400 transition-all";
    const labelClass = "block text-gray-700 text-sm font-medium mb-1"; // Labels un poco más finos como en la foto

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Head title="Sortu Pisua" />

            {/* Fondo gris muy suave para que resalte la tarjeta blanca */}
            <main className="flex-grow flex items-center justify-center bg-gray-50 p-6">
                
                {/* TARJETA PRINCIPAL: ESTILO EXACTO DE LA FOTO */}
                {/* bg-white, borde azul (border-blue-400), esquinas redondeadas (rounded-2xl) */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-blue-400 p-8">
                    
                    {/* Título estilo formulario "GEHITU..." */}
                    <h1 className="text-xl font-normal text-center mb-6 text-gray-700 uppercase tracking-wide">
                        SORTU PISUA
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
                                required
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

                        {/* BOTONES DE ACCIÓN: Estilo amarillo y azul apagado */}
                        <div className="flex items-center justify-between gap-4 pt-4 mt-6">
                            
                            {/* BOTÓN UTZI (Amarillo como en la foto) */}
                            <Link 
                                href="/pisua" 
                                className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-xl shadow-sm text-center transition-colors"
                            >
                                Utzi
                            </Link>

                            {/* BOTÓN SORTU (Azul grisáceo/Indigo suave como en la foto) */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-1/2 bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Sortzen...' : 'Sortu'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}