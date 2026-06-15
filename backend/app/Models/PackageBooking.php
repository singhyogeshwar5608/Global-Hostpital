<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageBooking extends Model
{
    protected $fillable = [
        'package_id', 'package_name', 'package_price', 'patient_name',
        'patient_email', 'patient_phone', 'patient_age', 'patient_gender',
        'booking_date', 'preferred_date', 'preferred_time', 'address',
        'payment_method', 'payment_status', 'booking_status',
    ];

    protected $casts = [
        'booking_date' => 'datetime',
        'preferred_date' => 'date',
    ];
}
