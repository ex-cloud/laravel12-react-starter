<?php

use App\Http\Controllers\Profile\AvatarController;
use App\Http\Controllers\Profile\ProfilePublicController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('profile')->group(function () {
    // PATCH untuk update profile dari halaman publik
    Route::patch('/{username}', [ProfilePublicController::class, 'updateFromPublic'])
        ->name('profile.public.update');

    // POST untuk upload avatar
    Route::post('/{username}/avatar', [AvatarController::class, 'update'])
        ->name('profile.avatar.update');

    // GET untuk tampilkan halaman profil user publik
    Route::get('/{username}', [ProfilePublicController::class, 'show'])
        ->where('username', '^(?!login$|register$|dashboard$|admin$|settings$)[A-Za-z0-9-_]+$')
        ->name('profile.show');
});
