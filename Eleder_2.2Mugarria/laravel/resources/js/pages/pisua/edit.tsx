import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/Components/Footer'; 

interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
}

interface EditProps {
    pisua: Pisua;
}

export default function Edit({ pisua }: EditProps) {
    // Inertia useForm datuak kudeatzeko
    const { data, setData, put, processing, errors } = useForm({
        pisuaren_izena: pisua.izena || '',
        pisuaren_kodigoa: pisua.kodigoa || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = `/pisua/${pisua.id}`;
        put(url);
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                
                <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8">
                    
                    {/* TITLE (Uppercase & Centered like image) */}
                    <h1 className="text-2xl font-medium text-center mb-8 text-gray-800 uppercase tracking-wide">
                        EDITATU PISUA
                    </h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Pisuaren Izena Input */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="izena">
                                Izena
                            </label>
                            <input
                                id="izena"
                                type="text"
                                value={data.pisuaren_izena}
                                onChange={e => setData('pisuaren_izena', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                                    errors.pisuaren_izena ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Pisuaren izena"
                            />
                            {errors.pisuaren_izena && (
                                <p className="text-red-500 text-xs mt-1">{errors.pisuaren_izena}</p>
                            )}
                        </div>

                        {/* Pisuaren Kodigoa Input */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="kodigoa">
                                Kodea
                            </label>
                            <input
                                id="kodigoa"
                                type="text"
                                value={data.pisuaren_kodigoa}
                                onChange={e => setData('pisuaren_kodigoa', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                                    errors.pisuaren_kodigoa ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Pisuaren kodea"
                            />
                            {errors.pisuaren_kodigoa && (
                                <p className="text-red-500 text-xs mt-1">{errors.pisuaren_kodigoa}</p>
                            )}
                        </div>

                        {/* BUTTON (Yellow, Full Width) */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out transform active:scale-95"
                            >
                                {processing ? 'Gordetzen...' : 'Editatu'}
                            </button>
                        </div>

                        {/* Back Link */}
                        <div className="text-center mt-4">
                            <Link 
                                href="/pisua"
                                className="text-sm text-gray-500 hover:text-gray-800 underline decoration-gray-300 underline-offset-4"
                            >
                                Utzi eta itzuli zerrendara
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}