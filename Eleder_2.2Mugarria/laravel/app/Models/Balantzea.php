<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Balance extends Model
{
    use HasFactory;

    protected $table = 'balances';

    protected $fillable = [
        'user_id',
        'saldo',
    ];

    /**
     * Usuario al que pertenece este balance
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
