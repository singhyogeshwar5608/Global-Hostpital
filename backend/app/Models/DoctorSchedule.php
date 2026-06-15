<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorSchedule extends Model
{
    protected $fillable = [
        'doctor_id', 'doctor_name', 'specialty', 'available_days',
        'available_slots', 'slot_duration',
    ];

    protected $casts = [
        'available_days' => 'array',
        'available_slots' => 'array',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
