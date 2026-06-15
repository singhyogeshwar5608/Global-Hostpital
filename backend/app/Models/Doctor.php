<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'photo', 'name', 'qualification', 'degree', 'specialty', 'experience',
        'mobile', 'email', 'hospital_name', 'district', 'state', 'country',
        'address', 'consultancy_fee', 'status', 'password', 'last_login',
        'is_online', 'rating', 'total_consultations', 'total_revenue',
        'assigned_patient_ids', 'assigned_lab_ids', 'assigned_countries',
        'assigned_states', 'assigned_districts', 'permissions',
        'profile_visibility', 'patient_access',
    ];

    protected $casts = [
        'assigned_patient_ids' => 'array',
        'assigned_lab_ids' => 'array',
        'assigned_countries' => 'array',
        'assigned_states' => 'array',
        'assigned_districts' => 'array',
        'permissions' => 'array',
        'profile_visibility' => 'array',
        'patient_access' => 'array',
        'is_online' => 'boolean',
        'last_login' => 'datetime',
    ];
}
