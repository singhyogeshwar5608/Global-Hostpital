<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LabCertificate;
use Illuminate\Http\Request;

class LabCertificateController extends Controller
{
    public function index()
    {
        return LabCertificate::with('lab')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lab_id' => 'required|exists:labs,id',
            'certificate_name' => 'required|string|max:255',
            'file_url' => 'required|url',
            'issued_by' => 'nullable|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'is_verified' => 'boolean',
        ]);
        return LabCertificate::create($validated);
    }

    public function show(LabCertificate $labCertificate)
    {
        return $labCertificate->load('lab');
    }

    public function update(Request $request, LabCertificate $labCertificate)
    {
        $validated = $request->validate([
            'certificate_name' => 'sometimes|string|max:255',
            'file_url' => 'sometimes|url',
            'issued_by' => 'nullable|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'is_verified' => 'boolean',
        ]);
        $labCertificate->update($validated);
        return $labCertificate;
    }

    public function destroy(LabCertificate $labCertificate)
    {
        $labCertificate->delete();
        return response()->noContent();
    }

    public function byLab($labId)
    {
        return LabCertificate::where('lab_id', $labId)->get();
    }
}
