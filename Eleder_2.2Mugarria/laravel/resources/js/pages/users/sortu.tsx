import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/components/footer';

const Sortu = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        mota: 'user', 
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-100 p-6 flex justify-center items-start">
                <Head title="Erabiltzaile Berria" />

                <div className="w-full max-w-lg bg-white shadow-lg rounded-3xl p-8 border border-blue-400 mt-4">
                    <h1 className="text-xl font-normal text-center text-gray-800 mb-6 uppercase tracking-wide">
                        GEHITU ERABILTZAILEA
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Izena */}
                        <div>
                            <label className="block text-md font-medium text-gray-700 mb-1">Izena</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-1.5 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        {/* Emaila */}
                        <div>
                            <label className="block text-md font-medium text-gray-700 mb-1">Emaila</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-1.5 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                            />
                            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                        </div>

                        {/* Pasahitza */}
                        <div>
                            <label className="block text-md font-medium text-gray-700 mb-1">Pasahitza</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full px-4 py-1.5 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                            />
                            {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                        </div>

                        {/* Rol-a */}
                        <div>
                            <label className="block text-md font-medium text-gray-700 mb-1">Rol-a</label>
                            <select
                                value={data.mota}
                                onChange={e => setData('mota', e.target.value)}
                                className="w-full px-4 py-1.5 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white"
                            >
                                <option value="user">Erabiltzailea</option>
                                <option value="admin">Administratzailea</option>
                            </select>
                            {errors.mota && <div className="text-red-500 text-xs mt-1">{errors.mota}</div>}
                        </div>

                        {/* Botones: Gehitu (Azul) a la izquierda y Utzi (Amarillo) a la derecha */}
                        <div className="flex items-center justify-between pt-6">
                            <Link 
                                href="/users" 
                                className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 rounded-2xl font-bold shadow-md transition border border-yellow-500 text-center min-w-[120px]"
                            >
                                Utzi
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#9db1d6] hover:bg-[#8ca2cb] text-black px-8 py-2 rounded-2xl font-medium shadow-md transition disabled:opacity-50 min-w-[200px]"
                            >
                                Gehitu
                            </button>

                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Sortu;