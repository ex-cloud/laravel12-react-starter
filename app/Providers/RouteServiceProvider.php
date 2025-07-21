<?php
// app/Providers/RouteServiceProvider.php

namespace App\Providers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        parent::boot();

        Route::model('article', Article::class);
        Route::model('category', Category::class);
        Route::model('tag', Tag::class);
    }
}
