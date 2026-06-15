<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    public function index() { return Hospital::all(); }
    public function store(Request $r) { return Hospital::create($r->all()); }
    public function show(Hospital $hospital) { return $hospital; }
    public function update(Request $r, Hospital $hospital) { $hospital->update($r->all()); return $hospital; }
    public function destroy(Hospital $hospital) { $hospital->delete(); return response()->noContent(); }
}
