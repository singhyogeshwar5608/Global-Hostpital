<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    public function index()
    {
        return Advertisement::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:testimonial,youtube,instagram,banner',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'media_url' => 'nullable|url',
            'thumbnail_url' => 'nullable|url',
            'redirect_url' => 'nullable|url',
            'has_inquiry_button' => 'boolean',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);
        return Advertisement::create($validated);
    }

    public function show(Advertisement $advertisement)
    {
        return $advertisement;
    }

    public function update(Request $request, Advertisement $advertisement)
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:testimonial,youtube,instagram,banner',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'media_url' => 'nullable|url',
            'thumbnail_url' => 'nullable|url',
            'redirect_url' => 'nullable|url',
            'has_inquiry_button' => 'boolean',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);
        $advertisement->update($validated);
        return $advertisement;
    }

    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();
        return response()->noContent();
    }

    public function public()
    {
        return Advertisement::where('is_active', true)->orderBy('sort_order')->get();
    }
}
