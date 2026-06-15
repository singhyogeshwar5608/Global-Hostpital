<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'full_name', 'mobile_number', 'email', 'gender', 'date_of_birth',
        'blood_group', 'address', 'country', 'state', 'district', 'city',
        'pin_code', 'latitude', 'longitude', 'disease_details', 'symptoms',
        'complaint', 'medical_history', 'allergies', 'current_medications',
        'emergency_contact_name', 'emergency_contact_number',
        'emergency_relationship', 'is_active', 'registration_date',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
        'registration_date' => 'datetime',
    ];
}
