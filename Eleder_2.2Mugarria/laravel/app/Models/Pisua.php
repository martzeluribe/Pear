<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pisua extends Model
{

    use HasFactory;

    protected $table = 'pisua';

    protected $fillable = [
        'izena',
        'kodigoa',
        'odoo_id',
        'synced',
        'sync_error',
        'user_id',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

}
