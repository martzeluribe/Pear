import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/Components/Footer';
import { Plus } from 'lucide-react';

export default function Sortu() {
    const [preview, setPreview] = useState<string | null>(null);

    // Destructuramos 'setError' y 'clearErrors' para manejar errores manuales
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        izena: '',
        deskripzioa: '',
        helbidea: '',
        imagen: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pisua'); 
    };

    // --- BALIDAZIO LOGIKA (EUSKERA) ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // 1. Balidatu tamaina (5MB = 5 * 1024 * 1024 bytes)
            const MAX_SIZE = 5 * 1024 * 1024; 
            
            if (file.size > MAX_SIZE) {
                // MENSAJE EN EUSKERA
                setError('imagen', 'Argazkia handiegia da. Gehienez 5MB onartzen da.');
                
                // Garbitu inputa
                e.target.value = ''; 
                return; 
            }

            // 2. Balidatu formatua (Segurtasun extra)
            if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
                // MENSAJE EN EUSKERA
                setError('imagen', 'Fitxategi-mota okerra. JPG, PNG edo WEBP formatuak bakarrik.');
                return;
            }

            // Dena ondo badago:
            clearErrors('imagen'); // Kendu errore zaharrak
            setData('imagen', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-700 placeholder-gray-400 transition-all";
    const labelClass = "block text-gray-700 text-sm font-medium mb-1"; 

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Head title="Sortu Pisua" />

            <main className="flex-grow flex items-center justify-center bg-gray-50 p-6">
                
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-blue-400 p-8">
                    
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
                            <div className="flex justify-between items-end mb-1">
                                <label className={labelClass}>Argazkia</label>
                                <span className="text-xs text-gray-400 font-medium">(Max: 5MB)</span>
                            </div>
                            
                            {preview && (
                                <div className="mb-3 relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={preview} alt="Aurreikuspena" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <label className={`flex items-center justify-center w-full px-4 py-2 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50 transition-colors ${errors.imagen ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}>
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
                            {/* Mensaje de error (Validación frontend y backend) */}
                            {errors.imagen && <p className="text-red-500 text-xs mt-1 font-bold">{errors.imagen}</p>}
                        </div>

                        {/* EKINTZA BOTOIAK */}
                        <div className="flex items-center justify-between gap-4 pt-4 mt-6">
                            
                            {/* UTZI BOTOIA */}
                            <button 
                                type="button" 
                                onClick={handleBack}
                                className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-xl shadow-sm text-center transition-colors"
                            >
                                Utzi
                            </button>

                            {/* SORTU BOTOIA */}
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