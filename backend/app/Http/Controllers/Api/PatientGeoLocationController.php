<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PatientGeoLocation;
use Illuminate\Http\Request;

class PatientGeoLocationController extends Controller
{
    public function index()
    {
        return PatientGeoLocation::with('patient')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'ip_address' => 'nullable|string',
            'country' => 'nullable|string|max:255',
            'country_code' => 'nullable|string|size:2',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'latitude' => 'nullable|string|max:20',
            'longitude' => 'nullable|string|max:20',
            'currency_code' => 'nullable|string|size:3',
            'currency_symbol' => 'nullable|string|max:10',
        ]);
        return PatientGeoLocation::create($validated);
    }

    public function show(PatientGeoLocation $patientGeoLocation)
    {
        return $patientGeoLocation->load('patient');
    }

    public function update(Request $request, PatientGeoLocation $patientGeoLocation)
    {
        $validated = $request->validate([
            'ip_address' => 'nullable|string',
            'country' => 'nullable|string|max:255',
            'country_code' => 'nullable|string|size:2',
            'state' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'latitude' => 'nullable|string|max:20',
            'longitude' => 'nullable|string|max:20',
            'currency_code' => 'nullable|string|size:3',
            'currency_symbol' => 'nullable|string|max:10',
        ]);
        $patientGeoLocation->update($validated);
        return $patientGeoLocation;
    }

    public function byPatient($patientId)
    {
        $geo = PatientGeoLocation::where('patient_id', $patientId)->first();
        if (!$geo) {
            return response()->json(['message' => 'No geo location found'], 404);
        }
        return $geo;
    }
}
