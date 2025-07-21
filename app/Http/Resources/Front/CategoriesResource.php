<?php

declare(strict_types=1);

namespace App\Http\Resources\Front;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

/**
 * @property \App\Models\Category $resource
 * @mixin \App\Models\Category
 */
final class CategoriesResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'slug'         => $this->slug,
            'description'  => $this->description,
            'is_active'    => $this->is_active,
            'is_featured'  => $this->is_featured,
            'created_at'   => $this->getCreatedAtResource('Asia/Jakarta', 'd F Y, H:i'),
            // 'updated_at'   => $this->resource->getUpdatedAtResource('Asia/Jakarta', 'd F Y, H:i'),
        ];
    }
}
