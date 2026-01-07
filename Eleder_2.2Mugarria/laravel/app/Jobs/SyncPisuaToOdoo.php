<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Pisua;
use App\Services\OdooService;
use Exception;


class SyncPisuaToOdoo implements ShouldQueue
{
    use Queueable;

    protected Pisua $pisua;
    public $tries = 5;
    public $backoff = [30, 60, 120, 300, 500]; //segundotan


    /**
     * Create a new job instance.
     */
    public function __construct(Pisua $pisua)
    {
        $this->pisua = $pisua;
    }

    /**
     * Execute the job.
     */
    public function handle(OdooService $odoo): void
    {
        try{

            $sortzailea = $this->pisua->load('user')->user;
            $odooId = $odoo->create('pisua', [  //name eta code odoo eremuen izenak dira. Berdinak izan behar dira.
                'name' => $this->pisua->izena,
                'code' => $this->pisua->kodigoa,
                'coordinator_id'=> $sortzailea->odoo_id,
            ]);

            $this->pisua->update([
                'odoo_id' => $odooId,
                'synced' => true,
                'sync_error' => null,
            ]);

            
        } catch(Exception $e){
            $this->pisua->update([
                "sync_error" => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
