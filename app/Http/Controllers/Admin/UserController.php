<?php
declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BulkDeleteRequest;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

final class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        // Batasi perPage maksimum
        $maxPerPage = 100;
        $perPage = min((int) $request->get('perPage', 10), $maxPerPage);
        $perPage = $perPage > 0 ? $perPage : 10;
        $perPage = $perPage > 0 ? min($perPage, 100) : 10;

        $query = User::query();

        // Filter search
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // ✅ Sorting (new)
        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');
        $allowedSorts = ['name', 'username', 'email', 'created_at', 'updated_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $order === 'asc' ? 'asc' : 'desc');
        }

        // Ambil data Server-side pagination
        $users = $query->paginate($perPage)->appends($request->only(['search', 'perPage', 'sort', 'order']));
        // $allIds = $query->pluck('id')->toArray();
        // Return ke Inertia
        return Inertia::render('Admin/Users/Index', [
            'users' => [
                'data' => UserResource::collection($users)->resolve(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ],
                'links' => [
                    'prev' => $users->previousPageUrl(),
                    'next' => $users->nextPageUrl(),
                ],
            ],
            'totalCount' => $users->total(),
            // 'allIds' => $allIds,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request): RedirectResponse
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
        // Hanya gunakan flash success untuk menghindari konflik toast
        return redirect()->route('admin.users.index')->with([
            'success' => 'User berhasil ditambahkan.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => (new UserResource($user))->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => (new UserResource($user))->resolve()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user): RedirectResponse
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
    public function destroy(User $user): RedirectResponse
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

        return redirect()->route('admin.users.index')->with([
            'success' => 'User berhasil dihapus.',
        ]);
    }

    public function bulkDelete(BulkDeleteRequest $request): RedirectResponse
    {
        $selectAll = $request->boolean('selectAll');
        $selectedIds = $request->input('selectedIds', []);
        $search = $request->input('activeSearch');
        $deleted = 0;

        if ($selectAll) {
            $query = User::query();

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $deleted = $query->delete();
        } else {
            $deleted = User::whereIn('id', $selectedIds)->delete();
        }

        return back()->with('success', "{$deleted} pengguna berhasil dihapus.");
    }
}
