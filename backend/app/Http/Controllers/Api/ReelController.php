<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reel;
use Illuminate\Http\Request;

class ReelController extends Controller
{
    public function index()
    {
        return Reel::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|string|max:500',
            'title' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);
        return Reel::create($validated);
    }

    public function show(Reel $reel)
    {
        return $reel;
    }

    public function update(Request $request, Reel $reel)
    {
        $validated = $request->validate([
            'url' => 'sometimes|string|max:500',
            'title' => 'sometimes|string|max:255',
            'is_active' => 'boolean',
        ]);
        $reel->update($validated);
        return $reel;
    }

    public function destroy(Reel $reel)
    {
        $reel->delete();
        return response()->noContent();
    }
}
