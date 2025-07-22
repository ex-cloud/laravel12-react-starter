<?php
declare(strict_types=1);

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Enums\GenderEnum;
use App\Http\Requests\Profile\ProfilePublicUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

final class ProfilePublicController extends Controller
{
    public function show(string $username): Response
    {
        // Hindari bentrok dengan path-path sensitif
        if (in_array($username, ['login', 'register', 'forgot-password', 'reset-password', 'logout'])) {
            abort(404);
        }
        $user = User::where('username', $username)->firstOrFail();

        // Debugging: Cek apakah profile ada
        // dd($user->load('profile'));
        // dd($user->profile);
        return Inertia::render('Profile/Show', [
            'user' => (new UserResource($user->load('profile')))->toArray(request()),
            'genders' => GenderEnum::values(),
        ]);
    }

    public function updateFromPublic(ProfilePublicUpdateRequest $request, string $username): RedirectResponse
    {
        $user = $request->user();

        if ($user->username !== $username) {
            abort(403);
        }

        $data = $request->validated();

        if ($user->email !== $data['email']) {
            $user->email_verified_at = null;
        }

        $user->fill($data)->save();

        if (isset($data['profile'])) {
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                $data['profile']
            );
        }

        return redirect()->route('profile.show', $user->username)->with('status', 'Profile updated!');
    }
}
