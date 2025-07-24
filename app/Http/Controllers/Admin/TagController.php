<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        // Batasi perPage maksimum
        $maxPerPage = 100;
        $perPage = min((int) $request->get('perPage', 10), $maxPerPage);
        $perPage = $perPage > 0 ? $perPage : 10;

        $query = Tag::query()
            ->withCount('articles')
            ->orderBy('articles_count', 'desc');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Ambil data Server-side pagination

        $tags = $query->paginate($perPage)->appends($request->only(['search', 'perPage']));

        return Inertia::render('Admin/Tags/Index', [
            'tags' => [
                'data' => TagResource::collection($tags)->resolve(),
                'meta' => [
                    'current_page' => $tags->currentPage(),
                    'last_page' => $tags->lastPage(),
                    'per_page' => $tags->perPage(),
                    'total' => $tags->total(),
                ],
                'links' => [
                    'prev' => $tags->previousPageUrl(),
                    'next' => $tags->nextPageUrl(),
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tags/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name'],
        ]);

        Tag::create($validated);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag berhasil ditambahkan.');
    }
    public function show(Tag $tag)
    {
        return Inertia::render('Admin/Tags/Show', [
            'tag' => (new TagResource($tag))->resolve(),
        ]);
    }

    public function edit(Tag $tag): Response
    {
        return Inertia::render('Admin/Tags/Edit', [
            'tag' => (new TagResource($tag))->resolve()
        ]);
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name,' . $tag->id],
        ]);

        $tag->update($validated);

        return back(303)->with('success', 'Tag berhasil diperbarui.');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('admin.tags.index')->with([
            'success' => 'Tag berhasil dihapus.',
        ]);
    }
}
