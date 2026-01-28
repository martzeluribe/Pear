<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pisua;
use App\Models\User; // Añadido para usarlo en addMember
use App\Jobs\SyncPisuaToOdoo;
use App\Jobs\SyncOdooToPisua;
use App\Services\OdooService;
use App\Jobs\SyncEditPisuaToOdoo;
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
        $type = $request->input('type', 'izena'); // Por defecto busca por nombre
        
        $query->where($type, 'LIKE', "%{$search}%");
    }

    $pisuak = $query->get();

    return Inertia::render('pisua/erakutsi', [ // Ruta correcta con Mayúsculas
        'pisuak' => $pisuak,
        // ESTO ES LO IMPORTANTE PARA QUE NO FALLE EL FILTRO:
        'filters' => $request->only(['search', 'type']), 
    ]);
}
    public function create()
    {
        return Inertia::render('pisua/sortu');
    }

    public function store(Request $request)
    {
        // 1. Validamos los datos (incluida la imagen)
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'deskripzioa' => 'nullable|string|max:1000',
            'helbidea' => 'nullable|string|max:255',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB
        ]);

        // 2. Procesar la imagen si existe
        $imagenPath = null;
        if ($request->hasFile('imagen')) {
            $imagenPath = $request->file('imagen')->store('pisuak', 'public');
        }

        // 3. Crear el piso en la base de datos
        $pisua = Pisua::create([
            'izena' => $validated['izena'],
            'deskripzioa' => $validated['deskripzioa'] ?? null,
            'helbidea' => $validated['helbidea'] ?? null,
            'kodigoa' => Str::random(10), // Código único
            'user_id' => Auth::id(), // Tú eres el dueño
            'imagen_path' => $imagenPath, 
        ]);

        // 4. CORREGIDO: Usamos users() en lugar de miembros()
        $pisua->users()->attach(Auth::id());

        // 5. Redirigir a "Mis Pisos"
        return redirect()->route('pisua.nire_pisuak');
    }

    public function edit(Pisua $pisua)
    {
        return Inertia::render('pisua/edit', compact('pisua'));
    }

    public function update(Request $request, $id)
    {
        // 1. Bilatu pisua
        $pisua = Pisua::findOrFail($id);

        // Ziurtatu erabiltzailea jabea dela (segurtasuna)
        if ($pisua->user_id !== Auth::id()) {
            abort(403, 'Ez daukazu baimenik pisu hau editatzeko.');
        }

        // 2. Balidazioa
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'deskripzioa' => 'nullable|string|max:1000',
            'helbidea' => 'nullable|string|max:255',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB
        ]);

        // 3. Irudiaren kudeaketa
        if ($request->hasFile('imagen')) {
            // A) Irudi zaharra badu, ezabatu diskotik
            if ($pisua->imagen_path && Storage::disk('public')->exists($pisua->imagen_path)) {
                Storage::disk('public')->delete($pisua->imagen_path);
            }
            // B) Irudi berria igo
            $pisua->imagen_path = $request->file('imagen')->store('pisuak', 'public');
        }

        // 4. Datuak eguneratu
        $pisua->update([
            'izena' => $validated['izena'],
            'deskripzioa' => $validated['deskripzioa'] ?? null,
            'helbidea' => $validated['helbidea'] ?? null,
        ]);

        return redirect()->route('pisua.nire_pisuak')->with('success', 'Pisua ondo eguneratu da!');
    }

    public function destroy(Pisua $pisua)
    {
        // 1. Borramos el piso
        $pisua->delete();

        // 2. Redirigimos a la lista
        return to_route('pisua.index');
    }

    public function userDashboard()
    {
        $user = auth()->user();

        // 1. Pisos donde eres ADMINISTRADOR (dueño)
        $adminPisuak = $user->pisosAdministrados()
            ->with('users') 
            ->get()
            ->map(function ($pisua) {
                $pisua->rol_actual = 'admin';
                return $pisua;
            });

        // 2. Pisos donde eres MIEMBRO (estás invitado)
        $kidePisuak = $user->pisosComoMiembro()
            ->with('users') 
            ->get()
            ->map(function ($pisua) {
                $pisua->rol_actual = 'kide';
                return $pisua;
            });

        // 3. Juntamos las dos listas
        $pisuak = $adminPisuak->merge($kidePisuak)->unique('id')->values();

        return Inertia::render('erabiltzailePisua/nirePisuak', [
            'pisuak' => $pisuak
        ]);
    }

    public function show($id)
    {
        $pisua = Pisua::with('users')->findOrFail($id);
        
        // Comprobamos si el ID del usuario conectado coincide con el 'user_id' (dueño) del piso
        $isAdmin = auth()->id() === $pisua->user_id; 

        return Inertia::render('pisua/Show', [
            'pisua' => $pisua,
            'isAdmin' => $isAdmin 
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

        // CORREGIDO: Usamos users() en lugar de miembros()
        if ($pisua->users()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['email' => 'Erabiltzaile hau jada pisukidea da.']);
        }

        // CORREGIDO: Usamos users() en lugar de miembros()
        $pisua->users()->attach($user->id);

        return back();
    }
}