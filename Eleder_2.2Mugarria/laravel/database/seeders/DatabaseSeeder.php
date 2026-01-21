<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Jobs\SyncUserToOdoo;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $coord = User::create(
            [
                'name' => 'Saioa Koordinatzailea',
                'email' => 'saioa@pisos.com',
                'password' => Hash::make('password'),
                'mota' => 'koordinatzailea'
            ]

        );

        SyncUserToOdoo::dispatch($coord);

        echo 'Koordinatzailea sortuta eta Job-era bidalita\n';

        $this->call([
            UserSeeder::class,
            // Otros seeders si los tuvieras...
        ]);

    }

}
