<?php
declare(strict_types=1);

namespace App\Models;

use App\Enums\GenderEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'birthdate',
        'gender',
        'marital_status',
        'phone',
        'address',
    ];

    protected $casts = [
        'gender' => GenderEnum::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
