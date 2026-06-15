<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index() { return Medicine::all(); }
    public function store(Request $r) { return Medicine::create($r->all()); }
    public function show(Medicine $medicine) { return $medicine; }
    public function update(Request $r, Medicine $medicine) { $medicine->update($r->all()); return $medicine; }
    public function destroy(Medicine $medicine) { $medicine->delete(); return response()->noContent(); }
}
