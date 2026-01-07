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

    public function index(OdooService $odoo)
    {

        $pisuak = $odoo->search('pisua', ['name','code']);
        // dump($pisuak);
        return Inertia::render('pisua/erakutsi', [
            'pisuak' => $pisuak,
        ]);
    }

    public function create()
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
}
