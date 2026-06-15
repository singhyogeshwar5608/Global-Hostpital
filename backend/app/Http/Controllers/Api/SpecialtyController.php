<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Specialty;
use Illuminate\Http\Request;

class SpecialtyController extends Controller
{
    public function index() { return Specialty::with('questions')->get(); }

    public function store(Request $r)
    {
        $r->validate(['name' => 'required|string|max:255']);
        return Specialty::create($r->all());
    }

    public function show(Specialty $specialty) { return $specialty->load('questions'); }

    public function update(Request $r, Specialty $specialty)
    {
        $specialty->update($r->all());
        return $specialty;
    }

    public function destroy(Specialty $specialty)
    {
        $specialty->delete();
        return response()->noContent();
    }
}
