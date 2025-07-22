<?php
declare(strict_types=1);

namespace App\Enums;

enum GenderEnum: string
{
    case MALE = 'Laki-Laki';
    case FEMALE = 'Perempuan';
    case OTHER = 'Lainnya';

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
