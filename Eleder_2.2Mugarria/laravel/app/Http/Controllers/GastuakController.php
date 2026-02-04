<?php

namespace App\Http\Controllers;

use App\Models\Gastuak;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GastuakController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validar los datos del formulario
        $validated = $request->validate([
            'konzeptua' => 'required|string|max:255',
            'zenbatekoa' => 'required|numeric|min:0.01',
            'data' => 'required|date',
            'pisua_id' => 'required|exists:pisua,id', // O "pisua", revisa tu tabla
            'ordaintzailea_id' => 'required|exists:users,id',
            'partaideak' => 'required|array|min:1', // Debe haber al menos un checkbox marcado
            'partaideak.*' => 'exists:users,id'
        ]);

        // 2. Crear el gasto general
        $gastu = Gastuak::create([
            'konzeptua' => $validated['konzeptua'],
            'zenbatekoa' => $validated['zenbatekoa'],
            'data' => $validated['data'],
            'pisua_id' => $validated['pisua_id'],
            'ordaintzailea_id' => $validated['ordaintzailea_id'],
        ]);

        // 3. Guardar los participantes (La magia de los checkboxes)
        $gastu->partaideak()->attach($validated['partaideak']);

        return redirect()->back();
    }

    public function destroy($id)
{
    $gastu = \App\Models\Gastuak::findOrFail($id);
    
    // Opcional: Comprobar si el usuario tiene permiso para borrarlo
    // if ($gastu->ordaintzailea_id !== auth()->id()) { abort(403); }

    $gastu->delete();

    return back(); // Recarga la página
}
}