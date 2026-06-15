<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    protected $fillable = [
        'name', 'logo', 'address', 'city', 'state', 'country', 'pin_code',
        'phone', 'email', 'website', 'emergency_number', 'registration_number',
        'type', 'specialty', 'bed_capacity', 'is_active',
    ];

    protected $casts = [
        'specialty' => 'array',
        'is_active' => 'boolean',
    ];
}
