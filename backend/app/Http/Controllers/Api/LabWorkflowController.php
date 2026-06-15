<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LabWorkflow;
use Illuminate\Http\Request;

class LabWorkflowController extends Controller
{
    public function index()
    {
        return LabWorkflow::with(['lab', 'patient', 'doctor'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lab_id' => 'required|exists:labs,id',
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'test_name' => 'required|string|max:255',
            'test_description' => 'nullable|string',
            'sample_status' => 'nullable|in:pending,collected,processing,completed',
            'status' => 'nullable|in:assigned,sample_pending,in_progress,completed,reviewed',
        ]);
        return LabWorkflow::create($validated);
    }

    public function show(LabWorkflow $labWorkflow)
    {
        return $labWorkflow->load(['lab', 'patient', 'doctor']);
    }

    public function update(Request $request, LabWorkflow $labWorkflow)
    {
        $validated = $request->validate([
            'sample_status' => 'nullable|in:pending,collected,processing,completed',
            'sample_collected_at' => 'nullable|date',
            'report_url' => 'nullable|url',
            'report_notes' => 'nullable|string',
            'status' => 'nullable|in:assigned,sample_pending,in_progress,completed,reviewed',
            'reviewed_by_doctor' => 'boolean',
            'reviewed_at' => 'nullable|date',
        ]);
        $labWorkflow->update($validated);
        return $labWorkflow;
    }

    public function destroy(LabWorkflow $labWorkflow)
    {
        $labWorkflow->delete();
        return response()->noContent();
    }

    public function byLab($labId)
    {
        return LabWorkflow::where('lab_id', $labId)->with(['patient', 'doctor'])->get();
    }

    public function byPatient($patientId)
    {
        return LabWorkflow::where('patient_id', $patientId)->with(['lab', 'doctor'])->get();
    }

    public function assignNearestLab(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'test_name' => 'required|string|max:255',
            'doctor_id' => 'nullable|exists:doctors,id',
        ]);

        $patient = \App\Models\Patient::findOrFail($validated['patient_id']);
        $labs = \App\Models\Lab::where('country', $patient->country)
            ->where('is_active', true)
            ->get();

        if ($labs->isEmpty()) {
            return response()->json(['message' => 'No labs available in your area'], 404);
        }

        $lab = $labs->first();

        $workflow = LabWorkflow::create([
            'lab_id' => $lab->id,
            'patient_id' => $validated['patient_id'],
            'doctor_id' => $validated['doctor_id'] ?? null,
            'test_name' => $validated['test_name'],
            'status' => 'assigned',
            'sample_status' => 'pending',
        ]);

        return response()->json($workflow->load(['lab', 'patient']), 201);
    }
}
