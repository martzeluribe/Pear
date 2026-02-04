import React, { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
    pisuaId: number;
}

export default function GastuModal({ isOpen, onClose, users, pisuaId }: Props) {
    // Inicializar el formulario con valores por defecto
    const { data, setData, post, processing, reset, errors } = useForm({
        konzeptua: '',
        zenbatekoa: '',
        ordaintzailea_id: '', // Quién pagó
        data: new Date().toISOString().split('T')[0], // Fecha de hoy YYYY-MM-DD
        partaideak: [] as number[], // Array de IDs de usuarios implicados
        pisua_id: pisuaId
    });

    if (!isOpen) return null;

const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/gastuak', {
            // "transform" permite modificar los datos justo antes de enviarlos.
            // Aquí forzamos que pisua_id sea el que recibimos por props.
            transform: (data) => ({
                ...data,
                pisua_id: pisuaId
            }),
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (errors) => {
                console.error("Errorea:", errors);
                // Opcional: alert("Faltan datos: " + Object.keys(errors).join(", "));
            }
        });
    };

    const handleCheckboxChange = (userId: number) => {
        if (data.partaideak.includes(userId)) {
            setData('partaideak', data.partaideak.filter(id => id !== userId));
        } else {
            setData('partaideak', [...data.partaideak, userId]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-xl font-bold text-center uppercase">Gastu Berria</h2>

                <form onSubmit={handleSubmit}>
                    {/* Kontzeptua */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">Kontzeptua</label>
                        <input
                            type="text"
                            placeholder="Adib: Komuneko papera"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.konzeptua}
                            onChange={e => setData('konzeptua', e.target.value)}
                            required
                        />
                        {errors.konzeptua && <div className="text-sm text-red-600">{errors.konzeptua}</div>}
                    </div>

                    {/* Zenbatekoa */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">Zenbatekoa</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00€"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.zenbatekoa}
                            onChange={e => setData('zenbatekoa', e.target.value)}
                            required
                        />
                         {errors.zenbatekoa && <div className="text-sm text-red-600">{errors.zenbatekoa}</div>}
                    </div>

                    <div className="flex gap-4 mb-4">
                        {/* Nork ordaindu du? */}
                        <div className="w-1/2">
                            <label className="block mb-1 font-medium text-gray-700">Nork ordaindu du?</label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.ordaintzailea_id}
                                onChange={e => setData('ordaintzailea_id', e.target.value)}
                                required
                            >
                                <option value="" disabled>Aukeratu...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                             {errors.ordaintzailea_id && <div className="text-sm text-red-600">{errors.ordaintzailea_id}</div>}
                        </div>

                        {/* Noiz? */}
                        <div className="w-1/2">
                            <label className="block mb-1 font-medium text-gray-700">Noiz?</label>
                            <input
                                type="date"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.data}
                                onChange={e => setData('data', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Nortzun artean? */}
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-700">Nortzun artean?</label>
                        <div className="space-y-2 border p-3 rounded-md">
                            {users.map(user => (
                                <div key={user.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`user-${user.id}`}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        checked={data.partaideak.includes(user.id)}
                                        onChange={() => handleCheckboxChange(user.id)}
                                    />
                                    <label htmlFor={`user-${user.id}`} className="ml-2 text-gray-700 select-none cursor-pointer">
                                        {user.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.partaideak && <div className="text-sm text-red-600">{errors.partaideak}</div>}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Utzi
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Gordetzen...' : 'Gehitu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}