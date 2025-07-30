<?php

use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Front\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
        Route::resource('tags', TagController::class);
        Route::post('/tags/bulk-delete', [TagController::class, 'bulkDelete'])->name('tags.bulk-delete');

        Route::resource('users', UserController::class);
        Route::post('/users/bulk-delete', [UserController::class, 'bulkDelete'])->name('users.bulk-delete');
    });

    Route::get('/admin/menus/builder', [MenuController::class, 'builder'])->name('menus.builder');
    Route::put('/admin/menus/order', [MenuController::class, 'updateOrder'])->name('menus.order.update');
    Route::post('/menus/sort', [MenuController::class, 'sort'])->name('menus.sort');
});

require __DIR__.'/settings.php';
require __DIR__ . '/profile.php';
require __DIR__.'/auth.php';

