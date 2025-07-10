<?php
declare(strict_types=1);

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user?->role ?? 'guest';

        $menu = Menu::where('slug', 'main')
            ->with([
                'items' => function ($query) use ($role) {
                    $query->whereJsonContains('roles', $role)
                        ->with(['children' => function ($q2) use ($role) {
                            $q2->whereJsonContains('roles', $role)->orderBy('order');
                        }])
                        ->orderBy('order');
                }
            ])
            ->first();

        return Inertia::render('HomePage', [
            'menu' => $menu,
        ]);
    }
}
