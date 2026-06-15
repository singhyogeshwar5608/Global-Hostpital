<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabWorkflow extends Model
{
    protected $fillable = [
        'lab_id', 'patient_id', 'doctor_id', 'test_name',
        'test_description', 'sample_status', 'sample_collected_at',
        'report_url', 'report_notes', 'status', 'reviewed_by_doctor',
        'reviewed_at',
    ];

    protected $casts = [
        'sample_collected_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'reviewed_by_doctor' => 'boolean',
    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
