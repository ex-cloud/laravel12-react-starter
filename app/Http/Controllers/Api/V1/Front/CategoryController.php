<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Front\CategoryFilterRequest;
use App\Http\Resources\Front\CategoriesResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class CategoryController extends Controller
{
    public function index(CategoryFilterRequest $request): AnonymousResourceCollection
    {
        $query = Category::query();
        $validated = $request->validated();

        if ($search = $validated['search'] ?? null) {
            $query->where('name', 'like', "%{$search}%");
        }

        return CategoriesResource::collection(
            $query->latest()->paginate(10)->appends($validated)
        );
    }

    public function show(Category $category): CategoriesResource|JsonResponse
    {
        return new CategoriesResource($category);
    }
}
