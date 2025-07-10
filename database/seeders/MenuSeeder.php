<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menu = Menu::firstOrCreate([
            'slug' => 'main',
        ], [
            'name' => 'Main Menu',
        ]);

        $menu->items()->delete();

        $menu->items()->create([
            'title' => 'Home',
            'url' => '/',
            'icon' => 'house', // ✅ Pastikan ini sesuai dengan ekspor Lucide
            'order' => 1,
            'roles' => ['admin', 'editor', 'guest'],
        ]);

        $blog = $menu->items()->create([
            'title' => 'Blog',
            'url' => '/posts',
            'icon' => 'file-text', // ✅ valid icon
            'order' => 2,
            'roles' => ['admin', 'editor', 'guest'],
        ]);

        $menu->items()->create([
            'title' => 'Dashboard',
            'url' => '/admin',
            'icon' => 'layout-dashboard', // ✅ valid icon
            'order' => 3,
            'roles' => ['admin'],
        ]);

        $blog->children()->createMany([
            [
                'menu_id' => $menu->id,
                'title' => 'Categories',
                'url' => '/categories',
                'icon' => 'Folder', // optional: atau null
                'order' => 1,
                'roles' => ['admin', 'editor'],
            ],
            [
                'menu_id' => $menu->id,
                'title' => 'Tags',
                'url' => '/tags',
                'icon' => 'Tag', // optional: atau null
                'order' => 2,
                'roles' => ['admin', 'editor'],
            ],
        ]);
        // About
        $menu->items()->create([
            'title' => 'About',
            'url' => '/about',
            'icon' => 'info',
            'order' => 6,
            'roles' => ['admin', 'editor', 'guest'],
        ]);

        // Contact
        $menu->items()->create([
            'title' => 'Contact',
            'url' => '/contact',
            'icon' => 'mail',
            'order' => 7,
            'roles' => ['admin', 'editor', 'guest'],
        ]);

        // Manage Service
        $manageService = $menu->items()->create([
            'title' => 'Manage Service',
            'url' => '/services',
            'icon' => 'server-cog',
            'order' => 8,
            'roles' => ['admin', 'editor'],
        ]);

        $manageService->children()->createMany([
            [
                'menu_id' => $menu->id,
                'title' => 'Add New Service',
                'url' => '/services/create',
                'icon' => 'plus-circle',
                'order' => 1,
                'roles' => ['admin'],
            ],
            [
                'menu_id' => $menu->id,
                'title' => 'Service List',
                'url' => '/services/list',
                'icon' => 'list',
                'order' => 2,
                'roles' => ['admin', 'editor'],
            ],
        ]);

        // Colocation
        $colocation = $menu->items()->create([
            'title' => 'Colocation',
            'url' => '/colocation',
            'icon' => 'building',
            'order' => 9,
            'roles' => ['admin', 'editor'],
        ]);

        $colocation->children()->createMany(
            [
                [
                    'menu_id' => $menu->id,
                    'title' => 'Racks',
                    'url' => '/colocation/racks',
                    'icon' => 'grid',
                    'order' => 1,
                    'roles' => ['admin', 'editor'],
                ],
                [
                    'menu_id' => $menu->id,
                    'title' => 'Power Usage',
                    'url' => '/colocation/power',
                    'icon' => 'zap',
                    'order' => 2,
                    'roles' => ['admin'],
                ],
            ]);
    }
}
