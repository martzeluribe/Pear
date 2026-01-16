import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            {/* Contenedor principal para asegurar que el footer se quede abajo si hay poco contenido */}
            <div className="flex flex-col min-h-screen bg-white">
                
                <Header />

                {/* Contenido Central */}
                <main className="flex-grow flex flex-col items-center justify-center p-6 lg:p-12">
                    
                    {/* Imagen de la aplicación (Mockup) */}
                    <div className="w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden mb-12 border-1 border-gray-200">
                        <img 
                            src="https://www.ikaslangipuzkoa.eus/es/centros/CIFP-miguel-altuna/@@images/8d3a9343-8f59-430c-99cf-cd8319d5a515.jpeg" 
                            alt="Pisukideak App Preview" 
                            className="w-full h-auto block"
                        />
                    </div>

                    {/* Sección de Descripción */}
                    <div className="text-center max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-widest uppercase mb-4 text-gray-800">
                            DESKRIPZIOA
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Aquí puedes escribir el breve texto que desees para describir tu aplicación 
                            y cómo ayuda a los usuarios a gestionar su convivencia.
                        </p>
                    </div>
                    
                </main>

                <Footer />
            </div>
        </>
    );
}