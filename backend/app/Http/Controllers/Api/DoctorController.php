<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    public function index()
    {
        return Doctor::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'photo' => 'nullable|string',
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'specialty' => 'required|string|max:255',
            'experience' => 'required|string|max:255',
            'mobile' => 'required|string|max:20',
            'email' => 'required|email|max:255|unique:doctors',
            'hospital_name' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'address' => 'required|string',
            'consultancy_fee' => 'required|numeric|min:0',
            'status' => 'nullable|in:active,inactive,suspended',
            'password' => 'required|string|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        return Doctor::create($validated);
    }

    public function show(Doctor $doctor)
    {
        return $doctor;
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validated = $request->validate([
            'photo' => 'nullable|string',
            'name' => 'sometimes|string|max:255',
            'qualification' => 'sometimes|string|max:255',
            'degree' => 'sometimes|string|max:255',
            'specialty' => 'sometimes|string|max:255',
            'experience' => 'sometimes|string|max:255',
            'mobile' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|max:255|unique:doctors,email,' . $doctor->id,
            'hospital_name' => 'sometimes|string|max:255',
            'district' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'consultancy_fee' => 'sometimes|numeric|min:0',
            'status' => 'nullable|in:active,inactive,suspended',
            'password' => 'sometimes|string|min:6',
            'permissions' => 'nullable|json',
            'profile_visibility' => 'nullable|json',
            'patient_access' => 'nullable|json',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $doctor->update($validated);
        return $doctor;
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();
        return response()->noContent();
    }
}
