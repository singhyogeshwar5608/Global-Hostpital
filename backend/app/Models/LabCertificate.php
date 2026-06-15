<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabCertificate extends Model
{
    protected $fillable = [
        'lab_id', 'certificate_name', 'file_url', 'issued_by',
        'issue_date', 'expiry_date', 'is_verified',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'is_verified' => 'boolean',
    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }
}
