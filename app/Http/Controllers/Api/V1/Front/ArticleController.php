<?php
declare(strict_types=1);

// app/Http/Controllers/Api/V1/Front/ArticleController.php

namespace App\Http\Controllers\Api\V1\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Front\ArticleFilterRequest;
use App\Http\Requests\Front\ArticleListRequest;
use App\Http\Resources\Front\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleController extends Controller
{
    // GET /api/v1/front/articles
    public function index(ArticleFilterRequest $request): AnonymousResourceCollection
    {
        $query = Article::query()
            ->with(['category', 'user', 'tags'])
            ->where('is_published', true);

        $validated = $request->validated();

        if ($search = $validated['search'] ?? null) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $validated['category_id'] ?? null) {
            $query->where('category_id', $categoryId);
        }

        if ($authorId = $validated['author_id'] ?? null) {
            $query->where('author_id', $authorId);
        }

        if ($status = $validated['status'] ?? null) {
            $query->where('status', $status);
        }

        if ($tag = $validated['tag'] ?? null) {
            $query->whereHas('tags', fn($q) => $q->where('name', $tag));
        }

        if ($sortBy = $validated['sort_by'] ?? null) {
            $sortDir = $validated['sort_dir'] ?? 'desc';
            $query->orderBy($sortBy, $sortDir);
        }

        return ArticleResource::collection(
            $query->latest()->paginate(10)->appends($validated)
        );
    }

    // GET /api/v1/front/articles/{slug}
    public function show(Article $article)
    {
        abort_unless($article->is_published, 404);

        return new ArticleResource($article->load(['user', 'category', 'tags']));
    }

    // GET /api/v1/front/articles/popular
    public function popular(ArticleListRequest $request): AnonymousResourceCollection
    {
        $limit = (int) $request->validated('limit', 5);

        $articles = Article::with(['category', 'user', 'tags'])
            ->where('is_published', true)
            ->orderByDesc('views')
            ->limit($limit)
            ->get();

        return ArticleResource::collection($articles);
    }

    // GET /api/v1/front/articles/recent
    public function recent(ArticleListRequest $request): AnonymousResourceCollection
    {
        $limit = (int) $request->validated('limit', 5);

        $articles = Article::with(['category', 'user', 'tags'])
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();

        return ArticleResource::collection($articles);
    }

    // GET /api/v1/front/articles/{slug}/related
    public function related(Article $article): AnonymousResourceCollection
    {
        if (!$article->category_id) {
            return ArticleResource::collection(collect());
        }

        $related = Article::with(['category', 'user', 'tags'])
            ->where('is_published', true)
            ->where('id', '!=', $article->id)
            ->where('category_id', $article->category_id)
            ->limit(5)
            ->get();

        return ArticleResource::collection($related);
    }
}
