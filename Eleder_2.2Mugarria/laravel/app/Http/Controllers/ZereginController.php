<?php

namespace App\Http\Controllers;

use App\Models\Zereginak;
use App\Models\User; // <--- HAU GEHITU BEHAR DA
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ZereginController extends Controller
{
    public function index(Request $request)
{
    // --- 1. GARBIKETA AUTOMATIKOA (Hau gehitu dugu) ---
    // Norbait orrialdera sartzen den bakoitzean, astebete baino 
    // gehiago (7 egun) 'eginda' daramatenak ezabatu egingo dira.
    Zereginak::where('eginda', true)
        ->where('updated_at', '<', now()->subWeek())
        ->delete();


    // --- 2. OHIKO KODEA (Hemen jarraitzen du lehen zenuenak) ---
    $bilaketa = $request->input('bilaketa');

    $zereginak = Zereginak::with('arduraduna')
        ->when($bilaketa, function ($query, $bilaketa) {
            $query->where('izenburua', 'like', "%{$bilaketa}%");
        })
        ->orderBy('muga_data', 'asc')
        ->get();

    $erabiltzaileak = User::all(['id', 'name']);

    return Inertia::render('Zereginak/Index', [
        'zereginak' => $zereginak,
        'erabiltzaileak' => $erabiltzaileak,
        'filters' => [
            'bilaketa' => $bilaketa
        ]
    ]);
}

    public function store(Request $request)
    {
        $orain = now()->format('Y-m-d H:i');

        $validated = $request->validate([
            'izenburua' => 'required|string|max:255',
            'muga_data' => 'required|date|after_or_equal:' . $orain,
            'arduraduna_id' => 'required|exists:users,id', // <--- BALIDAZIO BERRIA
        ], [
            'izenburua.required' => 'Kontzeptua idaztea derrigorrezkoa da.',
            'muga_data.required' => 'Data eta ordua zehaztea derrigorrezkoa da.',
            'muga_data.after_or_equal' => 'Ezin da iraganeko data bat aukeratu.',
            'arduraduna_id.required' => 'Arduradun bat aukeratu behar duzu.', // <--- MEZUA EUSKARAZ
        ]);

        Zereginak::create([
            'izenburua' => $validated['izenburua'],
            'muga_data' => $validated['muga_data'],
            'eginda' => false,
            // 'user_id' sortzailea da, baina 'arduraduna_id' da lana egingo duena
            'user_id' => Auth::id(), 
            'arduraduna_id' => $validated['arduraduna_id'], // <--- DATU-BASEAN GORDE
        ]);

        return redirect()->back();
    }

    // ... update eta destroy funtzioak berdin jarraitzen dute
    public function update(Request $request, $id)
    {
        $zeregina = Zereginak::findOrFail($id);
        $zeregina->update(['eginda' => $request->boolean('eginda')]);
        return redirect()->back();
    }

    public function destroy($id)
    {
        $zeregina = Zereginak::findOrFail($id);
        $zeregina->delete();
        return redirect()->back();
    }
}