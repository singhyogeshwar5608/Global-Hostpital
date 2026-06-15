<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DoctorSchedule;
use Illuminate\Http\Request;

class DoctorScheduleController extends Controller
{
    public function index() { return DoctorSchedule::all(); }
    public function store(Request $r) { return DoctorSchedule::create($r->all()); }
    public function show(DoctorSchedule $doctorSchedule) { return $doctorSchedule; }
    public function update(Request $r, DoctorSchedule $doctorSchedule) { $doctorSchedule->update($r->all()); return $doctorSchedule; }
    public function destroy(DoctorSchedule $doctorSchedule) { $doctorSchedule->delete(); return response()->noContent(); }
}
