<?php

namespace App\Http\Controllers;

use App\Models\Zereginak;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ZereginController extends Controller
{
    public function index(Request $request)
    {
        // --- 1. GARBIKETA AUTOMATIKOA ---
        // Astebete baino gehiago (7 egun) 'eginda' daramatenak ezabatu.
        Zereginak::where('eginda', true)
            ->where('updated_at', '<', now()->subWeek())
            ->delete();

        // --- 2. OHIKO KODEA ---
        $bilaketa = $request->input('bilaketa');

        // Oharra: Hemen normalean erabiltzailearen pisuaren arabera iragazi beharko litzateke,
        // baina oraingoz horrela utziko dugu orokorra izan dadin.
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
            'arduraduna_id' => 'required|exists:users,id',
            'pisua_id' => 'required|exists:pisua,id', // <--- FUNTSEZKOA: Pisua lotu
        ], [
            'izenburua.required' => 'Kontzeptua idaztea derrigorrezkoa da.',
            'muga_data.required' => 'Data eta ordua zehaztea derrigorrezkoa da.',
            'muga_data.after_or_equal' => 'Ezin da iraganeko data bat aukeratu.',
            'arduraduna_id.required' => 'Arduradun bat aukeratu behar duzu.',
            'pisua_id.required' => 'Errorea: Ez da pisua identifikatu.',
        ]);

        Zereginak::create([
            'izenburua' => $validated['izenburua'],
            'muga_data' => $validated['muga_data'],
            'eginda' => false,
            'arduraduna_id' => $validated['arduraduna_id'], // Arduraduna
            'pisua_id' => $validated['pisua_id'], // <--- PISUA GORDE
        ]);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $zeregina = Zereginak::findOrFail($id);
        
        // Segurtasuna: Bakarrik pisu bereko kideek aldatu dezakete (aukerakoa, baina gomendagarria)
        // if ($zeregina->pisua_id !== ... logika hemen ...) 

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