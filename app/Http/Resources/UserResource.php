<?php
declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return array
     * @property \App\Models\User $resource
     */
    public function toArray(Request $request): array
    {
        // if ($this->resource->avatar && str_contains($this->resource->avatar, '//')) {
        //     \Log::warning('Avatar path tidak valid: ' . $this->resource->avatar);
        // }
        return [
            'id'       => $this->resource->id,
            'name'     => $this->resource->name,
            'username' => $this->resource->username,
            'email'    => $this->resource->email,
            'avatar' => get_safe_avatar_url($this->resource->avatar),

            'profile' => $this->whenLoaded('profile', fn() => (new ProfileResource($this->resource->profile))->toArray($request)),

            'created_at' => $this->resource->getCreatedAtResource(),
            'updated_at' => $this->resource->getUpdatedAtResource(),
        ];
    }
}
