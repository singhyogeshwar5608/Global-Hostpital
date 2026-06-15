<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lab;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LabController extends Controller
{
    public function index()
    {
        return Lab::with(['certificates', 'documents'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lab_name' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'owner_qualification' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:50',
            'registration_number' => 'nullable|string|max:100',
            'signature_url' => 'nullable|url',
            'technician' => 'nullable|json',
            'pathologist' => 'nullable|json',
            'is_active' => 'boolean',
            'password' => 'required|string|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        return Lab::create($validated);
    }

    public function show(Lab $lab)
    {
        return $lab->load(['certificates', 'documents']);
    }

    public function update(Request $request, Lab $lab)
    {
        $validated = $request->validate([
            'lab_name' => 'sometimes|string|max:255',
            'district' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'owner_name' => 'sometimes|string|max:255',
            'owner_qualification' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:50',
            'registration_number' => 'nullable|string|max:100',
            'signature_url' => 'nullable|url',
            'technician' => 'nullable|json',
            'pathologist' => 'nullable|json',
            'is_active' => 'boolean',
            'password' => 'sometimes|string|min:6',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $lab->update($validated);
        return $lab;
    }

    public function destroy(Lab $lab)
    {
        $lab->delete();
        return response()->noContent();
    }
}
