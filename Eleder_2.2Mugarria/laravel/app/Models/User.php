<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',        // nombre del usuario
        'email',       // correo
        'password',    // contraseña
        'mota',        // tipo de usuario
        'odoo_id',     // ID externo (Odoo)
        'synced',      // estado de sincronización
        'sync_error',  // error de sincronización
    ];
    /*User bakoitzak zein pisu dituen jakiteko.*/
    /**
     * Pisos donde el usuario está dentro (relación muchos a muchos)
     */
    // public function pisuak()
    // {
    //     return $this->belongsToMany(Pisua::class, 'pisua_user')
    //                 ->withTimestamps();
    // }

    // /**
    //  * Pisos que el usuario posee (dueño)
    //  */
    // public function ownedPisuak()
    // {
    //     return $this->hasMany(Pisua::class, 'user_id');
    // }



    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
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
