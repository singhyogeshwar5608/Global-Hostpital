<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index()
    {
        return Prescription::with(['doctor', 'patient'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'hospital_name' => 'nullable|string|max:255',
            'symptoms' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'medicines' => 'nullable|array',
            'medicines.*.name' => 'required_with:medicines|string',
            'medicines.*.dosage' => 'nullable|string',
            'medicines.*.duration' => 'nullable|string',
            'medicines.*.timing' => 'nullable|string',
            'test_recommendations' => 'nullable|array',
            'doctor_notes' => 'nullable|string',
            'follow_up_date' => 'nullable|string',
            'prescription_pdf' => 'nullable|string',
        ]);
        return Prescription::create($validated);
    }

    public function show(Prescription $prescription)
    {
        return $prescription->load(['doctor', 'patient']);
    }

    public function update(Request $request, Prescription $prescription)
    {
        $validated = $request->validate([
            'symptoms' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'medicines' => 'nullable|array',
            'test_recommendations' => 'nullable|array',
            'doctor_notes' => 'nullable|string',
            'follow_up_date' => 'nullable|string',
            'prescription_pdf' => 'nullable|string',
        ]);
        $prescription->update($validated);
        return $prescription;
    }

    public function destroy(Prescription $prescription)
    {
        $prescription->delete();
        return response()->noContent();
    }

    public function byPatient($patientId)
    {
        return Prescription::where('patient_id', $patientId)->with('doctor')->get();
    }

    public function byDoctor($doctorId)
    {
        return Prescription::where('doctor_id', $doctorId)->with('patient')->get();
    }
}
