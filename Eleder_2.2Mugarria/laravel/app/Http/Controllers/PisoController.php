<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pisua;
use App\Models\User;
use App\Models\Zereginak; // Inportantea zereginak kargatzeko
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PisoController extends Controller
{
    public function index(Request $request)
    {
        $query = Pisua::query();

        // Lógica de búsqueda
        if ($request->has('search')) {
            $search = $request->search;
            $type = $request->input('type', 'izena'); 
            
            $query->where($type, 'LIKE', "%{$search}%");
        }

        $pisuak = $query->get();

        // MANTENGO TU RUTA ORIGINAL
        return Inertia::render('pisua/erakutsi', [ 
            'pisuak' => $pisuak,
            'filters' => $request->only(['search', 'type']), 
        ]);
    }

    public function create()
    {
        // MANTENGO TU RUTA ORIGINAL
        return Inertia::render('pisua/sortu');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'deskripzioa' => 'nullable|string|max:1000',
            'helbidea' => 'nullable|string|max:255',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', 
        ]);

        $imagenPath = null;
        if ($request->hasFile('imagen')) {
            $imagenPath = $request->file('imagen')->store('pisuak', 'public');
        }

        $pisua = Pisua::create([
            'izena' => $validated['izena'],
            'deskripzioa' => $validated['deskripzioa'] ?? null,
            'helbidea' => $validated['helbidea'] ?? null,
            'kodigoa' => Str::random(10),
            'user_id' => Auth::id(),
            'imagen_path' => $imagenPath, 
        ]);

        $pisua->users()->attach(Auth::id());

        // MANTENGO TU REDIRECT ORIGINAL
        return redirect()->route('pisua.nire_pisuak');
    }

    // --- FUNCIÓN SHOW (FUSIONADA Y CORREGIDA) ---
    public function show(Pisua $pisua)
    {
        // 1. Cargar usuarios
        $pisua->load('users');

        // 2. Cargar tareas (Zereginak)
        $zereginak = Zereginak::where('pisua_id', $pisua->id)
            ->with('arduraduna')
            ->orderBy('muga_data', 'asc')
            ->get();
        
        // 3. Verificar si es admin
        $isAdmin = auth()->id() === $pisua->user_id; 

        // MANTENGO TU RUTA 'pisua/Show'
        return Inertia::render('pisua/Show', [
            'pisua' => $pisua,
            'isAdmin' => $isAdmin,
            'zereginak' => $zereginak // Pasamos las tareas
        ]);
    }
    // ---------------------------------------------

    public function edit(Pisua $pisua)
    {
        // MANTENGO TU RUTA ORIGINAL
        return Inertia::render('pisua/edit', compact('pisua'));
    }

    public function update(Request $request, $id)
    {
        $pisua = Pisua::findOrFail($id);

        if ($pisua->user_id !== Auth::id()) {
            abort(403, 'Ez daukazu baimenik pisu hau editatzeko.');
        }

        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'deskripzioa' => 'nullable|string|max:1000',
            'helbidea' => 'nullable|string|max:255',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        if ($request->hasFile('imagen')) {
            if ($pisua->imagen_path && Storage::disk('public')->exists($pisua->imagen_path)) {
                Storage::disk('public')->delete($pisua->imagen_path);
            }
            $pisua->imagen_path = $request->file('imagen')->store('pisuak', 'public');
        }

        $pisua->update([
            'izena' => $validated['izena'],
            'deskripzioa' => $validated['deskripzioa'] ?? null,
            'helbidea' => $validated['helbidea'] ?? null,
        ]);

        // MANTENGO TU REDIRECT ORIGINAL
        return redirect()->route('pisua.nire_pisuak')->with('success', 'Pisua ondo eguneratu da!');
    }

    public function destroy(Pisua $pisua)
    {
        $pisua->delete();
        // MANTENGO TU REDIRECT ORIGINAL
        return to_route('pisua.index');
    }

    public function userDashboard()
    {
        $user = auth()->user();

        $adminPisuak = $user->pisosAdministrados()
            ->with('users') 
            ->get()
            ->map(function ($pisua) {
                $pisua->rol_actual = 'admin';
                return $pisua;
            });

        $kidePisuak = $user->pisosComoMiembro()
            ->with('users') 
            ->get()
            ->map(function ($pisua) {
                $pisua->rol_actual = 'kide';
                return $pisua;
            });

        $pisuak = $adminPisuak->merge($kidePisuak)->unique('id')->values();

        // MANTENGO TU RUTA ORIGINAL
        return Inertia::render('erabiltzailePisua/nirePisuak', [
            'pisuak' => $pisuak
        ]);
    }

    public function addMember(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Ez da erabiltzailerik aurkitu email horrekin.', 
        ]);

        $pisua = Pisua::findOrFail($id);
        $user = User::where('email', $request->email)->first();

        if ($pisua->users()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['email' => 'Erabiltzaile hau jada pisukidea da.']);
        }

        $pisua->users()->attach($user->id);

        return back();
    }
}