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
        $validated = $request->validate([

            'pisuaren_izena' => 'required|string|max:255',
            'pisuaren_kodigoa' => 'required|string|max:255',
        
        ]);
        
        $pisua = Pisua::create([
            'izena' => $validated['pisuaren_izena'],
            'kodigoa' => $validated['pisuaren_kodigoa'],
            'synced' => false,
            'user_id' => Auth::id(),

        ]);
     
        SyncPisuaToOdoo::dispatch($pisua);

        return redirect()->route('pisua.index');
    }

    public function edit(Pisua $pisua)
    {
        return Inertia::render('pisua/edit',compact('pisua'));
    }

    public function update(Request $request, Pisua $pisua)
    {
        $validated = $request->validate([

            'pisuaren_izena' => 'required|string|max:255',
            'pisuaren_kodigoa' => 'required|string|max:255',
        
        ]);
        
        $pisua->update([
            'izena' => $validated['pisuaren_izena'],
            'kodigoa' => $validated['pisuaren_kodigoa'],
            'synced' => false,

        ]);

        SyncEditPisuaToOdoo::dispatch($pisua);

        return redirect()->route('pisua.index');
    }

    public function destroy(\App\Models\Pisua $pisua)
    {
        // 1. Borramos el piso
        $pisua->delete();

        // 2. Redirigimos a la lista
        return to_route('pisua.index');
    }
}
