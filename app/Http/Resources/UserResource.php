<?php
declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Str;

final class UserResource extends JsonResource
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return array
     * @property \App\Models\User $resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->resource->id,
            'name'     => $this->resource->name,
            'username' => $this->resource->username,
            'email'    => $this->resource->email,
            'avatar'   => $this->resource->avatar
                ? asset(Str::startsWith($this->resource->avatar, 'avatars/')
                    ? 'storage/' . $this->resource->avatar
                    : $this->resource->avatar)
                : asset('assets/default.jpg'),
            // ✅ Flatten ProfileResource langsung ke array

            'profile' => $this->whenLoaded('profile', fn() => (new ProfileResource($this->resource->profile))->toArray($request)),

            'created_at' => $this->resource->created_at?->format('Y-m-d H:i:s'), // atau tetap raw
            'updated_at' => $this->resource->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
