<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Andiansyah',
            'username' => 'andiansyah',
            'email' => 'andiansyah@kdua.net',
            'password' => Hash::make('Semangatku@25'),
            'avatar' => '/asset/default.jpg',
        ]);
    }
}
