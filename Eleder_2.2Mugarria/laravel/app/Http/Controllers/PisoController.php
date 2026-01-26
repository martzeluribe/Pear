<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pisua;
use App\Jobs\SyncPisuaToOdoo;
use App\Jobs\SyncOdooToPisua;
use App\Services\OdooService;
use App\Jobs\SyncEditPisuaToOdoo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // <-- Para la imagen

class PisoController extends Controller
{

public function index(Request $request)
{
    $query = Pisua::query();

    if ($request->has('search')) {
        $search = $request->input('search');
        // Usamos el parametro 'type' o por defecto 'izena'
        $type = $request->input('type', 'izena'); 
        
        // Mapeo seguro para evitar inyecciones de SQL si alguien manipula la URL
        $allowedColumns = ['izena', 'kodigoa', 'user_id'];
        
        if (in_array($type, $allowedColumns)) {
            $query->where($type, 'like', '%' . $search . '%');
        }
    }

    $pisuak = $query->get();

    return Inertia::render('pisua/erakutsi', [
        'pisuak' => $pisuak,
        'filters' => $request->only(['search', 'type']), // Pasamos 'type' de vuelta
    ]);
}    public function create()
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
        // HE CAMBIADO ESTO: de 2048 a 10240 (10MB) para que no falle tu imagen de IA
        'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', 
    ]);

    // 2. Procesar la imagen si existe
    $imagenPath = null;
    if ($request->hasFile('imagen')) {
        // Guarda la foto en la carpeta 'storage/app/public/pisuak'
        $imagenPath = $request->file('imagen')->store('pisuak', 'public');
    }

    // 3. Crear el piso en la base de datos
    $pisua = Pisua::create([
        'izena' => $validated['izena'],
        'deskripzioa' => $validated['deskripzioa'] ?? null,
        
        // --- ¡AQUÍ ESTABA EL PROBLEMA! ---
        // Faltaba esta línea, por eso no se guardaba la dirección:
        'helbidea' => $validated['helbidea'] ?? null,
        // ---------------------------------

        'kodigoa' => \Illuminate\Support\Str::random(10), // Código único
        'user_id' => Auth::id(), // Tú eres el dueño
        'imagen_path' => $imagenPath, // Guardamos la ruta de la foto
    ]);

    // 4. IMPORTANTE: Añadirte a ti mismo como miembro en la tabla pivote
    $pisua->miembros()->attach(Auth::id());

    // 5. Redirigir a "Mis Pisos"
    return redirect()->route('pisua.nire_pisuak');
}    public function edit(Pisua $pisua)
    {
        return Inertia::render('pisua/edit',compact('pisua'));
    }


    
public function update(Request $request, $id)
    {
        // 1. Bilatu pisua
        $pisua = Pisua::findOrFail($id);

        // Ziurtatu erabiltzailea jabea dela (segurtasuna)
        if ($pisua->user_id !== Auth::id()) {
            abort(403, 'Ez daukazu baimenik pisu hau editatzeko.');
        }

        // 2. Balidazioa (Sortu funtzioan bezala, baina irudia 'nullable' da)
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
            // 'kodigoa' ez dugu ukitzen, hori ez da aldatu behar normalean
            // 'imagen_path' jada eguneratu dugu goian baldintza barruan
        ]);

        return redirect()->route('pisua.nire_pisuak')->with('success', 'Pisua ondo eguneratu da!');
    }

public function destroy(\App\Models\Pisua $pisua)
{
        // 1. Borramos el piso
        $pisua->delete();

        // 2. Redirigimos a la lista
        return to_route('pisua.index');
}




public function userDashboard()
{
    $user = Auth::user();

    // 1. Pisos que TU administras (eres el creador)
    // Usamos 'with' para traer también la lista de miembros y pintarlos luego
    $adminPisuak = \App\Models\Pisua::where('user_id', $user->id)
        ->with('miembros') 
        ->get()
        ->map(function ($pisua) {
            $pisua->rol_actual = 'admin'; // Le ponemos una etiqueta para saber que mandas tú
            return $pisua;
        });

    // 2. Pisos donde eres MIEMBRO (estás invitado)
    $kidePisuak = $user->pisosComoMiembro()
        ->with('miembros')
        ->get()
        ->map(function ($pisua) {
            $pisua->rol_actual = 'kide'; // Etiqueta de "solo miembro"
            return $pisua;
        });

    // 3. Juntamos las dos listas (merge) y quitamos duplicados por si acaso
    $pisuak = $adminPisuak->merge($kidePisuak)->unique('id')->values();

    return Inertia::render('erabiltzailePisua/nirePisuak', [
        'pisuak' => $pisuak
    ]);
}
}


