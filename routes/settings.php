<?php

use App\Http\Controllers\Profile\ProfilePublicController;
use App\Http\Controllers\Settings\AvatarController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    // Tampilkan profil publik user untuk settings/profile/{username}
    Route::get('settings/profile/{username}', [ProfilePublicController::class, 'show'])
        ->name('profile.show');

    // Update profil publik user dengan PATCH
    Route::patch('settings/profile/{username}', [ProfilePublicController::class, 'updateFromPublic'])
        ->name('profile.public.update');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/settings/avatar', action: [AvatarController::class, 'update'])->name('avatar.update');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
