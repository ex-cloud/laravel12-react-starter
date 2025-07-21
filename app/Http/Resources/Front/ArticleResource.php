<?php
declare(strict_types=1);

// app/Http/Resources/Front/ArticleResource.php

namespace App\Http\Resources\Front;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property \App\Models\Article $resource
 * @mixin \App\Models\Article
 */
final class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'content' => $this->content,
            'image' => $this->image_url,
            'published_at' => $this->published_at?->toDateTimeString(),
            'status' => [
                'value' => $this->status instanceof \App\Enums\ArticleStatusEnum ? $this->status->value : $this->status,
                'label' => $this->status instanceof \App\Enums\ArticleStatusEnum ? $this->status->label() : ucfirst($this->status),
            ],
            'is_published' => $this->is_published,
            'views' => $this->views,
            'created_at'   => $this->getCreatedAtResource('Asia/Jakarta', 'd F Y, H:i'),
            'category' => $this->whenLoaded('category', fn() => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'author' => $this->whenLoaded('user', fn() => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ]),
            'tags' => $this->whenLoaded('tags', fn() => $this->tags->pluck('name'))
        ];
    }
}
