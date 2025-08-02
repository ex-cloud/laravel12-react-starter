<?php

use Illuminate\Support\Str;

function get_safe_avatar_url(?string $avatar): string
{
    if (!$avatar) {
        return asset('assets/default.jpg');
    }

    $clean = ltrim(trim($avatar), '/');

    // Jika URL absolut
    if (Str::startsWith($clean, ['http://', 'https://'])) {
        return $clean;
    }

    // Hanya izinkan path relatif tertentu
    if (
        !Str::startsWith($clean, ['avatars/', 'assets/', 'storage/avatars/'])
    ) {
        return asset('assets/default.jpg');
    }

    // Khusus untuk "avatars/" → storage path
    if (Str::startsWith($clean, 'avatars/')) {
        return asset('storage/' . $clean); // public/storage/avatars/...
    }

    // Jika sudah di dalam storage (misal: 'storage/avatars/...')
    if (Str::startsWith($clean, 'storage/avatars/')) {
        return asset($clean);
    }

    // Jika asset bawaan (assets/)
    return asset($clean);
}
