import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/Components/Footer'; 
import { PlusCircle } from 'lucide-react'; // Asegúrate de tener lucide-react instalado

export default function Sortu() {
    // 1. CAMBIO IMPORTANTE: Los nombres de los datos deben coincidir con lo que espera el Controlador
    // Y añadimos el campo imagen inicializado a null
    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        deskripzioa: '',
        helbidea: '',
        imagen: null as File | null, // Especificamos que puede ser un archivo
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Al usar post con un campo de archivo, Inertia lo detecta automáticamente
        post('/pisua'); 
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <Head title="Sortu Pisua" />

                {/* Contenedor principal con borde redondeado similar a la imagen */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-2xl shadow-sm">
                    
                    {/* TÍTULO */}
                    <h1 className="text-2xl text-center mb-8 text-gray-900 uppercase tracking-wide font-normal">
                        GEHITU PISUA
                    </h1>

                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* 1. IZENA */}
                        <div>
                            <label htmlFor="izena" className="block text-gray-800 text-base mb-2">
                                Izena
                            </label>
                            <input
                                type="text"
                                id="izena"
                                value={data.izena}
                                onChange={(e) => setData('izena', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                                required
                            />
                            {errors.izena && <p className="text-red-500 text-xs mt-1">{errors.izena}</p>}
                        </div>

                        {/* 2. DESKRIPZIOA (Nuevo) */}
                        <div>
                            <label htmlFor="deskripzioa" className="block text-gray-800 text-base mb-2">
                                Deskripzioa
                            </label>
                            <input
                                type="text"
                                id="deskripzioa"
                                value={data.deskripzioa}
                                onChange={(e) => setData('deskripzioa', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                            />
                            {errors.deskripzioa && <p className="text-red-500 text-xs mt-1">{errors.deskripzioa}</p>}
                        </div>

                        {/* 3. HELBIDEA (Nuevo) */}
                        <div>
                            <label htmlFor="helbidea" className="block text-gray-800 text-base mb-2">
                                Helbidea
                            </label>
                            <input
                                type="text"
                                id="helbidea"
                                value={data.helbidea}
                                onChange={(e) => setData('helbidea', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                            />
                            {errors.helbidea && <p className="text-red-500 text-xs mt-1">{errors.helbidea}</p>}
                        </div>

                        {/* 4. ARGAZKIA (Nuevo - Input de archivo personalizado) */}
                        <div>
                            <span className="block text-gray-800 text-base mb-2">Argazkia</span>
                            <label 
                                htmlFor="imagen" 
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto"
                            >
                                <PlusCircle className="w-5 h-5 text-gray-900" />
                                <span className="text-gray-900 font-medium">Gehitu argazkia</span>
                                {/* Input oculto para que funcione el estilo personalizado */}
                                <input
                                    type="file"
                                    id="imagen"
                                    name="imagen"
                                    accept="image/*"
                                    onChange={(e) => setData('imagen', e.target.files ? e.target.files[0] : null)}
                                    className="hidden" 
                                />
                            </label>
                            {/* Mostrar nombre del archivo si se ha seleccionado uno */}
                            {data.imagen && (
                                <p className="text-sm text-green-600 mt-2">
                                    Aukeratutako fitxategia: {data.imagen.name}
                                </p>
                            )}
                            {errors.imagen && <p className="text-red-500 text-xs mt-1">{errors.imagen}</p>}
                        </div>

                        {/* BOTÓN GEHITU (Azulado como en la imagen) */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#7B8BA5] hover:bg-[#6a7a94] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition duration-200"
                            >
                                {processing ? 'Sortzen...' : 'Gehitu'}
                            </button>
                        </div>
                        
                        {/* Link para cancelar */}
                         <div className="text-center">
                            <Link href="/pisua" className="text-gray-400 text-sm hover:underline">
                                Utzi eta itzuli
                            </Link>
                        </div>

                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}