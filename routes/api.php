<?php

use App\Http\Controllers\Api\V1\Front\ArticleController;
use App\Http\Controllers\Api\V1\Front\CategoryController;
use App\Http\Controllers\Api\V1\Front\TagController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/front')->group(function () {
    Route::prefix('tags')->group(function () {
        Route::get('/', [TagController::class, 'index']);
        Route::get('/{tag:slug}', [TagController::class, 'show']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{category:slug}', [CategoryController::class, 'show']);
    });

    Route::prefix('articles')->group(function () {
        Route::get('/', [ArticleController::class, 'index']);
        Route::get('/popular', [ArticleController::class, 'popular']);
        Route::get('/recent', [ArticleController::class, 'recent']);
        Route::get('/{article:slug}', [ArticleController::class, 'show']);
        Route::get('/{article:slug}/related', [ArticleController::class, 'related']);
    });
});
