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
    // 1. Cargar usuarios del piso
    $pisua->load('users');
    
    // 2. Cargar GASTOS (Tu lógica actual)
    $gastuak = \App\Models\Gastuak::where('pisua_id', $pisua->id)
        ->with(['ordaintzailea', 'partaideak']) 
        ->orderBy('data', 'desc')
        ->get();

    // 3. --- ¡NUEVO! CARGAR TAREAS (ZEREGINAK) ---
    // Buscamos las tareas de este piso y cargamos el nombre del responsable
    $zereginak = Zereginak::where('pisua_id', $pisua->id)
        ->with('arduraduna') // Para ver el nombre de quién tiene que hacerlo
        ->orderBy('muga_data', 'asc') // Ordenadas por fecha
        ->get();

    // 4. LOGICA DEL BALANCE (Tu lógica actual, sin cambios)
    $saldoak = [];
    foreach ($pisua->users as $user) {
        $saldoak[$user->id] = 0;
    }

    foreach ($gastuak as $gastu) {
        $pagadorId = $gastu->ordaintzailea_id;
        $cantidad = $gastu->zenbatekoa;
        $participantes = $gastu->partaideak;
        $numParticipantes = $participantes->count();

        if ($numParticipantes > 0) {
            $cuota = $cantidad / $numParticipantes;
            if (isset($saldoak[$pagadorId])) {
                $saldoak[$pagadorId] += $cantidad;
            }
            foreach ($participantes as $participante) {
                if (isset($saldoak[$participante->id])) {
                    $saldoak[$participante->id] -= $cuota;
                }
            }
        }
    }

    $balantzea = $pisua->users->map(function ($user) use ($saldoak) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'saldo' => round($saldoak[$user->id] ?? 0, 2)
        ];
    });

    // 5. DEVOLVER DATOS A INERTIA
    return Inertia::render('pisua/Show', [
        'pisua' => $pisua,
        // AQUÍ ESTABA EL ERROR: Antes ponía [], ahora pasamos la variable
        'zereginak' => $zereginak, 
        'gastuak' => $gastuak,
        'balantzea' => $balantzea,
        'users' => $pisua->users,
        'isAdmin' => Auth::id() === $pisua->user_id,
    ]);
}
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

    public function removeMember($pisuaId, $memberId)
    {
        $pisua = Pisua::findOrFail($pisuaId);

        // 1. SEGURIDAD: Solo el creador del piso (admin) puede echar a gente
        if (auth()->id() !== $pisua->user_id) {
            abort(403, 'Ez daukazu baimenik erabiltzaile hau kanporatzeko.');
        }

        // 2. SEGURIDAD: El admin no se puede borrar a sí mismo desde aquí
        if ($memberId == $pisua->user_id) {
            return back()->withErrors(['error' => 'Ezin duzu zure burua kanporatu.']);
        }

        // 3. ACCIÓN: Quitamos al usuario de la tabla pivote (pisua_user)
        // detach() elimina la relación sin borrar al usuario de la base de datos
        $pisua->users()->detach($memberId);

        return back(); // Recargamos la página
    }
}
