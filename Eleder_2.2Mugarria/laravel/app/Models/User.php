<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
// Importaciones para las relaciones
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'mota',       // Tu campo personalizado
        'odoo_id',    // Tu campo personalizado
        'synced',     // Tu campo personalizado
        'sync_error', // Tu campo personalizado
    ];

    /**
     * Pisos que el usuario administra/creó (Relación 1:N).
     * Laravel buscará en la tabla 'pisua' la columna 'user_id'.
     */
    public function pisosAdministrados(): HasMany
    {
        return $this->hasMany(Pisua::class, 'user_id');
    }

    /**
     * Pisos donde el usuario es miembro/inquilino (Relación N:M).
     * Usamos la tabla intermedia 'pisu_user'.
     */
    public function pisosComoMiembro(): BelongsToMany
    {
        // Nota: Asegúrate de que 'pisu_id' sea el nombre correcto en tu tabla pivote
        return $this->belongsToMany(Pisua::class, 'pisu_user', 'user_id', 'pisu_id')
                    ->withTimestamps();
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}