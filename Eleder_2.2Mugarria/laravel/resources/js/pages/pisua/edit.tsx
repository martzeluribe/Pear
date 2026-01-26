import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react'; // Head gehitu dut
import Header from '@/Components/Header'; 
import Footer from '@/Components/Footer';
import { Plus, Save } from 'lucide-react'; // Ikonoak

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
    // Irudiaren prebisualizazioa kudeatzeko egoera lokala
    const [preview, setPreview] = useState<string | null>(
        pisua.imagen_path ? `/storage/${pisua.imagen_path}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // GARRANTZITSUA: Fitxategiak igotzeko PUT spoofing behar da
        izena: pisua.izena || '',
        deskripzioa: pisua.deskripzioa || '',
        helbidea: pisua.helbidea || '',
        imagen: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 'post' erabiltzen dugu fitxategiak bidaltzeko, baina '_method: PUT' doa barruan
        post(`/pisua/${pisua.id}`);
    };

    // Irudia aldatzean prebisualizazioa eguneratu
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('imagen', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <Header />
            <Head title="Editatu Pisua" />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 border border-gray-100">
                    
                    {/* TITLE */}
                    <h1 className="text-2xl font-bold text-center mb-8 text-gray-800 uppercase tracking-wide">
                        EDITATU PISUA
                    </h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* 1. Izena */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="izena">
                                Izena
                            </label>
                            <input
                                id="izena"
                                type="text"
                                value={data.izena}
                                onChange={e => setData('izena', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${
                                    errors.izena ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="Adib: Etxe Alaia"
                            />
                            {errors.izena && <p className="text-red-500 text-xs mt-1">{errors.izena}</p>}
                        </div>

                        {/* 2. Deskripzioa */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripzioa">
                                Deskripzioa
                            </label>
                            <textarea
                                id="deskripzioa"
                                value={data.deskripzioa}
                                onChange={e => setData('deskripzioa', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all h-24 resize-none ${
                                    errors.deskripzioa ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="Pisuaren deskripzio laburra..."
                            />
                            {errors.deskripzioa && <p className="text-red-500 text-xs mt-1">{errors.deskripzioa}</p>}
                        </div>

                        {/* 3. Helbidea */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="helbidea">
                                Helbidea
                            </label>
                            <input
                                id="helbidea"
                                type="text"
                                value={data.helbidea}
                                onChange={e => setData('helbidea', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${
                                    errors.helbidea ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="Kale Nagusia 1, 2.B"
                            />
                            {errors.helbidea && <p className="text-red-500 text-xs mt-1">{errors.helbidea}</p>}
                        </div>

                        {/* 4. Argazkia (Preview-arekin) */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Argazkia
                            </label>
                            
                            {/* Prebisualizazioa */}
                            {preview && (
                                <div className="mb-3 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img 
                                        src={preview} 
                                        alt="Aurreikuspena" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="file"
                                    id="imagen"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <label 
                                    htmlFor="imagen"
                                    className="flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 hover:text-yellow-600 transition-colors group"
                                >
                                    <Plus className="w-5 h-5 mr-2 text-gray-400 group-hover:text-yellow-500" />
                                    <span className="text-gray-500 group-hover:text-yellow-600 font-medium">
                                        {data.imagen ? 'Argazkia aldatu' : 'Aldatu argazkia'}
                                    </span>
                                </label>
                            </div>
                            {errors.imagen && <p className="text-red-500 text-xs mt-1">{errors.imagen}</p>}
                        </div>

                        {/* BUTTON */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                {processing ? 'Gordetzen...' : 'Gorde Aldaketak'}
                            </button>
                        </div>

                        {/* Back Link */}
                        <div className="text-center mt-6">
                            <Link 
                                href="/nire-pisuak" 
                                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                ← Utzi eta itzuli zerrendara
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}