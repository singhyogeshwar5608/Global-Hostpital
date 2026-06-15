<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    protected $fillable = [
        'doctor_id', 'patient_id', 'hospital_name', 'symptoms',
        'diagnosis', 'medicines', 'test_recommendations',
        'doctor_notes', 'follow_up_date', 'prescription_pdf',
    ];

    protected $casts = [
        'medicines' => 'array',
        'test_recommendations' => 'array',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
