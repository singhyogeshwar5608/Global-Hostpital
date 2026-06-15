<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PatientBooking;
use Illuminate\Http\Request;

class PatientBookingController extends Controller
{
    public function index() { return PatientBooking::all(); }
    public function store(Request $r) { return PatientBooking::create($r->all()); }
    public function show(PatientBooking $patientBooking) { return $patientBooking; }
    public function update(Request $r, PatientBooking $patientBooking) { $patientBooking->update($r->all()); return $patientBooking; }
    public function destroy(PatientBooking $patientBooking) { $patientBooking->delete(); return response()->noContent(); }
}
