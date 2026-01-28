<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Zereginak extends Model
{
    use HasFactory;

    protected $table = 'zereginak';

    protected $fillable = [
        'izenburua',    // Euskaraz
        'muga_data',    // Euskaraz
        'eginda',       // Euskaraz
        'user_id'
    ];

    protected $casts = [
        'muga_data' => 'datetime',
        'eginda' => 'boolean',
    ];

    // Errlazioaren izena ere euskaraz: 'arduraduna'
    public function arduraduna(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}