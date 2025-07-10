<?php
declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Str;

final class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'username'   => $this->username,
            'email'      => $this->email,
            'avatar'     => $this->avatar
                ? asset(Str::startsWith($this->avatar, 'avatars/')
                    ? 'storage/' . $this->avatar
                    : $this->avatar)
                : asset('assets/default.jpg'),
            'created_at' => $this->created_at?->format('j F Y') ?? null,
        ];
    }
}
