<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicineOrder;
use Illuminate\Http\Request;

class MedicineOrderController extends Controller
{
    public function index() { return MedicineOrder::all(); }
    public function store(Request $r) { return MedicineOrder::create($r->all()); }
    public function show(MedicineOrder $medicineOrder) { return $medicineOrder; }
    public function update(Request $r, MedicineOrder $medicineOrder) { $medicineOrder->update($r->all()); return $medicineOrder; }
    public function destroy(MedicineOrder $medicineOrder) { $medicineOrder->delete(); return response()->noContent(); }
}
