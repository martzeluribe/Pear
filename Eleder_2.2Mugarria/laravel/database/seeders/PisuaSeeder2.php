<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pisua;
use App\Models\User;

class PisuaSeeder2 extends Seeder
{
    public function run(): void
    {
        // Crear un usuario por defecto si no existe
        $user = User::firstOrCreate(
            ['email' => 'admin@ejemplo.com'], // verifica si existe
            [
                'name' => 'Admin',
                'password' => bcrypt('password123'),
            ]
        );

        // Definir pisos con nombre y código únicos
        $pisos = [
            ['izena' => 'Bergara', 'kodigoa' => 'P-1001'],
            ['izena' => 'Durango', 'kodigoa' => 'P-1002'],
            ['izena' => 'Bilbao Centro', 'kodigoa' => 'P-1003'],
            ['izena' => 'Donostia Norte', 'kodigoa' => 'P-1004'],
            ['izena' => 'Gasteiz Sur', 'kodigoa' => 'P-1005'],
            ['izena' => 'Santurtzi', 'kodigoa' => 'P-1006'],
            ['izena' => 'Getxo', 'kodigoa' => 'P-1007'],
            ['izena' => 'Leioa', 'kodigoa' => 'P-1008'],
            ['izena' => 'Portugalete', 'kodigoa' => 'P-1009'],
        ];

        // Insertar pisos con odoo_id aleatorio y user_id del usuario creado
        foreach ($pisos as $piso) {
            Pisua::create([
                'izena' => $piso['izena'],
                'kodigoa' => $piso['kodigoa'],
                'odoo_id' => rand(1, 99999), // Odoo ID aleatorio
                'synced' => true,
                'sync_error' => null,
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
