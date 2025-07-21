<?php

declare(strict_types=1);

namespace App\Http\Resources\Front;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

final class CategoriesResource extends JsonResource
{

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return array
     * @property \App\Models\Category $resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->resource->id,
            'name'         => $this->resource->name,
            'slug'         => $this->resource->slug,
            'description'  => $this->resource->description,
            'is_active'    => $this->resource->is_active,
            'is_featured'  => $this->resource->is_featured,
            'created_at'  => $this->resource->created_at?->toISOString(), // tetap untuk kebutuhan teknis
            'updated_at'  => $this->resource->updated_at?->toISOString(),

            // 👇 tambahan bagian meta
            'meta' => [
                'created_at' => $this->resource->created_at
                    ? [
                        'human'    => $this->resource->created_at->diffForHumans(),
                        'string'   => $this->resource->created_at->format('d F Y, H:i'),
                        'local'    => $this->resource->created_at->timezone('Asia/Jakarta')->toDateTimeString(),
                        'timestamp' => $this->resource->created_at->timestamp,
                        'iso'      => $this->resource->created_at->toISOString(),
                    ]
                    : null,
                'updated_at' => $this->resource->updated_at
                    ? [
                        'human'    => $this->resource->updated_at->diffForHumans(),
                        'string'   => $this->resource->updated_at->format('d F Y, H:i'),
                        'local'    => $this->resource->updated_at->timezone('Asia/Jakarta')->toDateTimeString(),
                        'timestamp' => $this->resource->updated_at->timestamp,
                        'iso'      => $this->resource->updated_at->toISOString(),
                    ]
                    : null,
            ],
        ];
    }
}
