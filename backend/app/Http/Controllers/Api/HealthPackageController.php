<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthPackage;
use Illuminate\Http\Request;

class HealthPackageController extends Controller
{
    public function index() { return HealthPackage::all(); }
    public function store(Request $r) { return HealthPackage::create($r->all()); }
    public function show(HealthPackage $healthPackage) { return $healthPackage; }
    public function update(Request $r, HealthPackage $healthPackage) { $healthPackage->update($r->all()); return $healthPackage; }
    public function destroy(HealthPackage $healthPackage) { $healthPackage->delete(); return response()->noContent(); }
}
