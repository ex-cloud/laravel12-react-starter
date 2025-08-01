<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Panggil RoleSeeder dulu, agar role dan permission tersedia
        $this->call([
            RoleSeeder::class,
            TagSeeder::class,
            CategorySeeder::class,
            ArticleSeeder::class,
            MenuSeeder::class
        ]);

        // 2. Buat user admin
        $user = User::factory()->create([
            'name' => 'Andiansyah',
            'username' => 'andiansyah',
            'email' => 'andiansyah@kdua.net',
            'password' => Hash::make('Semangatku@25'),
        ]);

        // 3. Buat profil user
        Profile::create([
            'user_id' => $user->id,
            'birthdate' => '1995-01-30',
            'gender' => 'Laki-Laki',
            'marital_status' => 'Menikah',
            'phone' => '+62 81946702356',
            'address' => 'Jl. Sukarajin 2 lemahneundeut 2',
        ]);

        // 4. Assign role setelah role tersedia
        $user->assignRole('admin');

        // 5. Generate user dummy
        User::factory(24)->create();
    }
}
