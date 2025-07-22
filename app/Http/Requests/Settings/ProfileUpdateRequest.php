<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],

            'email' => [
                'sometimes',
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            'username' => [
                'sometimes',
                'required',
                'string',
                'lowercase',
                'alpha_dash',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'profile.gender' => ['nullable', 'string'],
            'profile.birthdate' => ['nullable', 'date'],
            'profile.phone' => ['nullable', 'string', 'max:20'],
            'profile.marital_status' => ['nullable', 'string'],
            'profile.address' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'confirmed'],
            'current_password' => ['nullable', 'required_with:password'],

        ];
    }
}
