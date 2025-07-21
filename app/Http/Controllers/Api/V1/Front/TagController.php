<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Front\TagFilterRequest;
use App\Http\Resources\Front\TagsResource;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class TagController extends Controller
{

    public function index(TagFilterRequest $request): AnonymousResourceCollection
    {
        $query = Tag::query();
        $validated = $request->validated();

        if ($search = $validated['search'] ?? null) {
            $query->where('name', 'like', "%{$search}%");
        }

        return TagsResource::collection(
            $query->latest()->paginate(10)->appends($validated)
        );
    }

    public function show(Tag $tag): TagsResource
    {
        return new TagsResource($tag);
    }
}
