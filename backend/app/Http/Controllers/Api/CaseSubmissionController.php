<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CaseSubmission;
use Illuminate\Http\Request;

class CaseSubmissionController extends Controller
{
    public function index() { return CaseSubmission::with(['patient', 'specialty', 'doctor', 'answers'])->get(); }

    public function store(Request $r)
    {
        $r->validate([
            'patient_id' => 'required|exists:patients,id',
            'specialty_id' => 'nullable|exists:specialties,id',
        ]);

        $data = $r->all();
        $data['case_id'] = 'CASE-' . strtoupper(uniqid());
        $data['status'] = $data['status'] ?? 'submitted';

        return CaseSubmission::create($data);
    }

    public function show(CaseSubmission $caseSubmission)
    {
        return $caseSubmission->load(['patient', 'specialty', 'doctor', 'answers.question']);
    }

    public function update(Request $r, CaseSubmission $caseSubmission)
    {
        $caseSubmission->update($r->all());
        return $caseSubmission;
    }

    public function destroy(CaseSubmission $caseSubmission)
    {
        $caseSubmission->delete();
        return response()->noContent();
    }

    public function byPatient($patientId)
    {
        return CaseSubmission::with(['specialty', 'doctor'])
            ->where('patient_id', $patientId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function updateStatus(Request $r, $id)
    {
        $case = CaseSubmission::findOrFail($id);
        $r->validate(['status' => 'required|string']);
        $case->update(['status' => $r->status]);
        return $case;
    }

    public function assignDoctor(Request $r, $id)
    {
        $case = CaseSubmission::findOrFail($id);
        $r->validate(['doctor_id' => 'required|exists:doctors,id']);
        $case->update([
            'doctor_id' => $r->doctor_id,
            'status' => 'doctor_assigned',
        ]);
        return $case;
    }
}
