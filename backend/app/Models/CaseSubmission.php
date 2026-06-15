<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseSubmission extends Model
{
    protected $fillable = [
        'case_id', 'patient_id', 'specialty_id', 'doctor_id',
        'status', 'appointment_date', 'appointment_time',
        'payment_status', 'notes',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function specialty()
    {
        return $this->belongsTo(Specialty::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function answers()
    {
        return $this->hasMany(CaseAnswer::class);
    }
}
