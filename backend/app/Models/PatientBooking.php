<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientBooking extends Model
{
    protected $fillable = [
        'patient_id', 'package_id', 'package_name', 'package_price',
        'patient_name', 'patient_email', 'patient_phone', 'payment_method',
        'payment_status', 'booking_status', 'meeting_link', 'doctor_id',
        'doctor_name', 'appointment_date', 'notes',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'package_price' => 'decimal:2',
    ];
}
