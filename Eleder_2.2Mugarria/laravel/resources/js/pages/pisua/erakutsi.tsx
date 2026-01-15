import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header'; 
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react'; // Asegúrate de tener lucide-react instalado

export default function Pisuak() {

    // --- DATOS DE EJEMPLO (Iguales a tu foto) ---
    const pisos = [
        {
            id: 1,
            izena: "Pisua 1",
            deskripzioa: "Deskripzioa",
            // Foto de salón con gente
            img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2064&auto=format&fit=crop", 
            bgColor: "bg-[#99dabb]", // Verde menta
            users: [
                { name: "Josune", color: "bg-[#ff7eb6]" }, // Rosa
                { name: "Martzel", color: "bg-[#fff585]" }, // Amarillo
                { name: "Eleder", color: "bg-[#ffb04f]" }, // Naranja
            ]
        },
        {
            id: 2,
            izena: "Pisua 2",
            deskripzioa: "Deskripzioa",
            // Foto de cocina
            img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop", 
            bgColor: "bg-[#ffdd94]", // Amarillo pastel
            users: [
                { name: "Luken", color: "bg-[#ff7eb6]" },
                { name: "Iker", color: "bg-[#fff585]" },
                { name: "Igor", color: "bg-[#ffb04f]" },
            ]
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Head title="Pisuak" />

            <Header />

            <main className="flex-1 px-4 py-8 md:px-12 lg:px-20">
                
                {/* CABECERA DE LA SECCIÓN */}
                <div className="mb-6 flex items-center justify-between border-b border-red-500 pb-2"> {/* Línea roja simulada */}
                    <div className="flex items-center gap-3">
                        {/* Icono de grupo */}
                        <Users className="h-10 w-10 text-black" strokeWidth={2} />
                        <h1 className="text-4xl font-normal text-black">Pisuak</h1>
                    </div>

                    {/* Botón Gehitu Pisua */}
                    {/* Usamos '#' para evitar el error de 'route' por ahora */}
                    <Link href="#"> 
                        <Button className="flex items-center gap-2 rounded-lg bg-[#6a65ff] px-6 py-6 text-lg text-white hover:bg-[#5853e0]">
                            <PlusCircle className="h-6 w-6" />
                            Gehitu pisua
                        </Button>
                    </Link>
                </div>

                {/* LISTADO DE PISOS */}
                <div className="flex flex-col gap-6">
                    {pisos.map((piso) => (
                        <div 
                            key={piso.id} 
                            className={`overflow-hidden rounded-xl shadow-sm ${piso.bgColor}`}
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                
                                {/* IMAGEN (Izquierda) */}
                                <div className="md:w-[450px] p-5">
                                    <img 
                                        src={piso.img} 
                                        alt={piso.izena} 
                                        className="h-64 w-full rounded-lg object-cover md:h-full shadow-sm"
                                    />
                                </div>

                                {/* CONTENIDO (Derecha) */}
                                <div className="flex flex-1 flex-col justify-between p-6 pl-2">
                                    
                                    {/* Título y descripción */}
                                    <div>
                                        <h2 className="text-3xl font-normal text-black mb-1">
                                            {piso.izena}
                                        </h2>
                                        <p className="text-2xl font-light text-black">
                                            {piso.deskripzioa}
                                        </p>
                                    </div>

                                    {/* Usuarios y Botón SARTU */}
                                    <div className="flex items-end justify-between mt-8">
                                        
                                        {/* Pastillas de colores */}
                                        <div className="flex flex-wrap gap-3">
                                            {piso.users.map((user, idx) => (
                                                <span 
                                                    key={idx}
                                                    className={`rounded-md px-4 py-1 text-base font-medium text-black shadow-sm ${user.color}`}
                                                >
                                                    {user.name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Botón SARTU */}
                                        <Button className="bg-[#1f3a60] px-8 py-2 text-lg font-bold text-white hover:bg-[#152a48]">
                                            SARTU
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </main>

            <Footer />
        </div>
    );
}