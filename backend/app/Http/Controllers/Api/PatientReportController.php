<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PatientReport;
use Illuminate\Http\Request;

class PatientReportController extends Controller
{
    public function index() { return PatientReport::all(); }
    public function store(Request $r) { return PatientReport::create($r->all()); }
    public function show(PatientReport $patientReport) { return $patientReport; }
    public function update(Request $r, PatientReport $patientReport) { $patientReport->update($r->all()); return $patientReport; }
    public function destroy(PatientReport $patientReport) { $patientReport->delete(); return response()->noContent(); }
}
