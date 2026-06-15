<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientReport extends Model
{
    protected $fillable = [
        'patient_id', 'file_name', 'file_type', 'file_format', 'file_size',
        'file_url', 'doctor_remarks', 'attached_to_prescription',
        'shared_with_doctor', 'uploaded_at',
    ];

    protected $casts = [
        'attached_to_prescription' => 'boolean',
        'shared_with_doctor' => 'boolean',
        'uploaded_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
