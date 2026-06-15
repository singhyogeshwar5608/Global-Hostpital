<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SpecialtyQuestion;
use Illuminate\Http\Request;

class SpecialtyQuestionController extends Controller
{
    public function index() { return SpecialtyQuestion::with('specialty')->get(); }

    public function store(Request $r)
    {
        $r->validate([
            'specialty_id' => 'required|exists:specialties,id',
            'question' => 'required|string|max:500',
        ]);
        return SpecialtyQuestion::create($r->all());
    }

    public function show(SpecialtyQuestion $specialtyQuestion) { return $specialtyQuestion->load('specialty'); }

    public function update(Request $r, SpecialtyQuestion $specialtyQuestion)
    {
        $specialtyQuestion->update($r->all());
        return $specialtyQuestion;
    }

    public function destroy(SpecialtyQuestion $specialtyQuestion)
    {
        $specialtyQuestion->delete();
        return response()->noContent();
    }

    public function bySpecialty($specialtyId)
    {
        return SpecialtyQuestion::where('specialty_id', $specialtyId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
}
