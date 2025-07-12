<?php
declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('users/users', [
            'users' => [
                'data' => UserResource::collection(User::latest()->get())->toArray(request()),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('users/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $validated = $request->validated();

        // Default avatar jika tidak diupload
        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public'); // disimpan di storage/app/public/avatars
        }

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'avatar' => $avatarPath, // bisa null, nanti default di-handle di resource
        ]);

        return redirect()->route('users.index')->with([
            'info' => 'Data sedang diproses.',
            'success' => 'User berhasil ditambahkan.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('users/show', [
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user' => (new UserResource($user))->resolve()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $validated = $request->validated();
        Log::info('Is multipart?', ['isMultipart' => $request->isMethod('put') && $request->has('name')]);
        Log::info('All input:', $request->all());
        Log::info('Validated:', $validated);


        Log::info('Validated data:', $validated);

        // Jika ada file avatar baru diupload
        if ($request->hasFile('avatar')) {
            // Hapus avatar lama jika ada dan bukan default
            if (
                $user->avatar &&
                Storage::disk('public')->exists($user->avatar) &&
                $user->avatar !== 'avatars/default.jpg'
            ) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Upload avatar baru dan simpan path-nya
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        } else {
            // ⛔️ Hapus field avatar jika hanya dikirim URL string
            unset($validated['avatar']);
        }
        if ($request->boolean('reset_avatar')) {
            if (
                $user->avatar &&
                Storage::disk('public')->exists($user->avatar) &&
                $user->avatar !== 'avatars/default.jpg'
            ) {
                Storage::disk('public')->delete($user->avatar);
            }

            $validated['avatar'] = null;
        }

        $user->update($validated);
        // dd($request->all(), $request->file('avatar'), $request->hasFile('avatar'));
        return back(303)->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Hapus avatar dari storage jika ada dan bukan default
        if (
            $user->avatar &&
            Storage::disk('public')->exists($user->avatar) &&
            $user->avatar !== 'avatars/default.jpg'
        ) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return redirect()->route('users.index')->with([
            'success' => 'User berhasil dihapus.',
        ]);
    }
}
