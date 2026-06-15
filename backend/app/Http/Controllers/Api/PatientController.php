<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index() { return Patient::all(); }
    public function store(Request $r) { return Patient::create($r->all()); }
    public function show(Patient $patient) { return $patient; }
    public function update(Request $r, Patient $patient) { $patient->update($r->all()); return $patient; }
    public function destroy(Patient $patient) { $patient->delete(); return response()->noContent(); }
}
