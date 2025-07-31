<?php

use Illuminate\Support\Str;

if (!function_exists('get_safe_avatar_url')) {
    function get_safe_avatar_url(?string $avatar): string
    {
        if (!$avatar) {
            return asset('assets/default.jpg');
        }

        $clean = ltrim(trim($avatar), '/');

        if (
            Str::contains($clean, '//') ||
            (!Str::startsWith($clean, ['avatars/', 'assets/']))
        ) {
            return asset('assets/default.jpg');
        }

        return Str::startsWith($clean, 'avatars/')
            ? asset('storage/' . $clean)
            : asset($clean);
    }
}
