<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
// AÑADIDO: Importaciones necesarias
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'mota',
        'odoo_id',
        'synced',
        'sync_error',
    ];

    /**
     * Pisos que el usuario administra/creó.
     * Laravel buscará en la tabla 'pisua' la columna 'user_id'.
     */
    public function pisosAdministrados(): HasMany
    {
        return $this->hasMany(Pisua::class, 'user_id');
    }

    /**
     * Pisos donde el usuario es miembro (inquilino).
     * Usamos la tabla intermedia 'pisu_user'.
     */
    public function pisosComoMiembro(): BelongsToMany
    {
        return $this->belongsToMany(Pisua::class, 'pisu_user', 'user_id', 'pisu_id')
                    ->withTimestamps();
    }

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}