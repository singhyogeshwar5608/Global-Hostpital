<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DoctorAuditLog;
use Illuminate\Http\Request;

class DoctorAuditLogController extends Controller
{
    public function index() { return DoctorAuditLog::all(); }
    public function store(Request $r) { return DoctorAuditLog::create($r->all()); }
    public function show(DoctorAuditLog $doctorAuditLog) { return $doctorAuditLog; }
    public function update(Request $r, DoctorAuditLog $doctorAuditLog) { $doctorAuditLog->update($r->all()); return $doctorAuditLog; }
    public function destroy(DoctorAuditLog $doctorAuditLog) { $doctorAuditLog->delete(); return response()->noContent(); }
}
