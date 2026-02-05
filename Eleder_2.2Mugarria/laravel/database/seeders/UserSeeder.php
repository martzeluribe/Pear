<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. USUARIO ADMIN
        User::create([
            'name'       => 'Administratzailea',
            'email'      => 'admin@gmail.com',
            'password'   => Hash::make('admin12345'), // La contraseña será 'password'
            'mota'       => 'admin',
            'odoo_id'    => null,
            'synced'     => false,
            'sync_error' => null,
        ]);

        // 2. USUARIO NORMAL (Ejemplo con datos de Odoo)
        User::create([
            'name'       => 'Erabiltzailea',
            'email'      => 'erabiltzaile@gmail.com',
            'password'   => Hash::make('erabiltzaile12345'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);
        // 2. USUARIO NORMAL (Ejemplo con datos de Odoo)
        User::create([
            'name'       => 'Ufufufuefuefue enit fuefuefue',
            'email'      => 'uwenubin@osas.com',
            'password'   => Hash::make('password'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);
        User::create([
            'name'       => 'Oiarzabal manco',
            'email'      => 'remanco@manquisimo.com',
            'password'   => Hash::make('password'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);
        User::create([
            'name'       => 'Kirky boy',
            'email'      => 'charliekirk@usagrateagain.com',
            'password'   => Hash::make('password'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);
        User::create([
            'name'       => 'leche mipalo',
            'email'      => 'xupxupa@xupa.com',
            'password'   => Hash::make('password'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);
        User::create([
            'name'       => '李 明轩',
            'email'      => '李明轩@erxino.com',
            'password'   => Hash::make('password'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);
        User::create([
            'name'       => 'user',
            'email'      => 'user@user.com',
            'password'   => Hash::make('password'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);
        User::create([
            'name'       => 'martzel putero',
            'email'      => 'puteriomax@gmail.sex',
            'password'   => Hash::make('password'),
            'mota'       => 'user',
            'odoo_id'    => rand(1, 999999),
            'synced'     => true,
            'sync_error' => null,
        ]);

        
    }
}