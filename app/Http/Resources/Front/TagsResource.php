<?php
declare(strict_types=1);
namespace App\Http\Resources\Front;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

final class TagsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     * @property \App\Models\Tag $resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->resource->id,
            'name'        => $this->resource->name,
            'slug'        => $this->resource->slug,
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
            // 'updated_at'  => $this->resource->getUpdatedAtResource('Asia/Jakarta', 'd F Y, H:i'),
        ];
    }
}
