<?php
declare(strict_types=1);

namespace App\Http\Requests\Profile;

use App\Enums\GenderEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

final class ProfilePublicUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Pastikan hanya user yang sedang login bisa update
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],

            'profile.gender' => ['nullable', 'string', Rule::in(GenderEnum::values())],
            'profile.birthdate' => ['nullable', 'date'],
            'profile.marital_status' => ['nullable', 'string', 'max:255'],
            'profile.phone' => [
                'nullable',
                'regex:/^\+?[0-9]{8,13}$/',
            ],
            'profile.address' => ['nullable', 'string'],
        ];
    }
}
