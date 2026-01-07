<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\User;
use App\Services\OdooService;
use Exception;

class SyncUserToOdoo implements ShouldQueue
{
    use Queueable;
    protected User $user;
    protected String $defaultOdooPass = '123456';

    /**
     * Create a new job instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(OdooService $odoo): void
    {

        $internalUserGroupId = 1;
        $coordGroupId = 42;

        try{
            if($this->user->mota === "koordinatzailea"){
                $userID = $odoo->create('res.users', [
                    'name' => $this->user->name,
                    'login' => $this->user->email,
                    'password' => $this->defaultOdooPass,
                    'active' => true,

                    'groups_id' => [
                        [4, $internalUserGroupId],
                        [4, $coordGroupId]
                    ]

                ]);

                $this->user->update([
                    "odoo_id" => $userID,
                    "synced" => true,
                    "sync_error" => null
                ]);

            }
        }catch(Exception $e){
            
            $this->user->update([
                "sync_error" => $e
            ]);

            throw $e;

        }
    }
}
