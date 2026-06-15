<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorAuditLog extends Model
{
    protected $fillable = [
        'doctor_id', 'doctor_name', 'action', 'details', 'date', 'time',
        'ip_address', 'device', 'location',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
