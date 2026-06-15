<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookedSlot extends Model
{
    protected $fillable = [
        'doctor_id', 'doctor_name', 'specialty', 'date', 'time',
        'patient_name', 'patient_email', 'patient_phone', 'patient_reason',
        'status', 'payment_status', 'payment_method', 'meeting_link', 'fee',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
