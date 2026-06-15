<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LabDocument;
use Illuminate\Http\Request;

class LabDocumentController extends Controller
{
    public function index()
    {
        return LabDocument::with('lab')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lab_id' => 'required|exists:labs,id',
            'document_type' => 'required|in:registration,gst,signature,other',
            'document_name' => 'required|string|max:255',
            'file_url' => 'required|url',
            'gst_number' => 'nullable|string|max:50',
            'is_verified' => 'boolean',
        ]);
        return LabDocument::create($validated);
    }

    public function show(LabDocument $labDocument)
    {
        return $labDocument->load('lab');
    }

    public function update(Request $request, LabDocument $labDocument)
    {
        $validated = $request->validate([
            'document_type' => 'sometimes|in:registration,gst,signature,other',
            'document_name' => 'sometimes|string|max:255',
            'file_url' => 'sometimes|url',
            'gst_number' => 'nullable|string|max:50',
            'is_verified' => 'boolean',
        ]);
        $labDocument->update($validated);
        return $labDocument;
    }

    public function destroy(LabDocument $labDocument)
    {
        $labDocument->delete();
        return response()->noContent();
    }

    public function byLab($labId)
    {
        return LabDocument::where('lab_id', $labId)->get();
    }
}
