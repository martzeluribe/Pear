<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('users/erakutsi', [
            'users' => User::query()
                ->when($request->input('search'), function ($query, $search) use ($request) {
                    $field = $request->input('field');

                    // --- CORRECCIÓN LÓGICA ---
                    // Convertimos la búsqueda a minúsculas para comparar mejor
                    $searchLower = strtolower($search);
                    $motaSearch = $search; 

                    // Si lo que ha escrito el usuario contiene 'erab' (ej: erab, erabil, erabiltzailea)
                    if (str_contains($searchLower, 'erab')) {
                        $motaSearch = 'user'; // Busca 'user' en la base de datos
                    } 
                    // Si lo que ha escrito el usuario contiene 'admin' (ej: admin, administ...)
                    elseif (str_contains($searchLower, 'admin')) {
                        $motaSearch = 'admin';
                    }
                    // --------------------------

                    if ($field && $field !== 'dena') {
                        // Si el campo elegido es MOTA, usamos la palabra traducida ($motaSearch)
                        if ($field === 'mota') {
                            $query->where('mota', 'like', "%{$motaSearch}%");
                        } else {
                            // Para el resto de campos (id, name, email...) usamos lo que escribió el usuario tal cual
                            $query->where($field, 'like', "%{$search}%");
                        }
                    } else {
                        // Lógica para "dena" (buscar en todo)
                        $query->where(function ($q) use ($search, $motaSearch) {
                            $q->where('id', 'like', "%{$search}%")
                              ->orWhere('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%")
                              // AQUÍ usamos la traducción: si escribió 'erab', buscará '%user%'
                              ->orWhere('mota', 'like', "%{$motaSearch}%") 
                              ->orWhere('created_at', 'like', "%{$search}%")
                              ->orWhere('updated_at', 'like', "%{$search}%");
                        });
                    }
                })
                ->get(),
            
            'filters' => $request->only(['search', 'field'])
        ]);
    }

    // ... Resto de funciones se mantienen igual ...
    public function edit(User $user) { return Inertia::render('users/editatu', ['user' => $user]); }
    public function update(Request $request, User $user) { 
        $validated = $request->validate([
            'name' => 'required|string|max:255', 'email' => 'required|email|unique:users,email,'.$user->id, 'mota' => 'required|string'
        ]);
        $user->update($validated);
        return Redirect::to('/users');
    }
    public function destroy(User $user) { $user->delete(); return Redirect::to('/users'); }
    public function create() { return Inertia::render('users/sortu'); }
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255', 'email' => 'required|email|unique:users,email', 'password' => 'required|string|min:8', 'mota' => 'required|string'
        ]);
        User::create($validated);
        return Redirect::to('/users');
    }
}