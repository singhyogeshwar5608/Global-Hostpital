<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lab extends Model
{
    protected $fillable = [
        'lab_name', 'district', 'state', 'country', 'owner_name',
        'owner_qualification', 'technician', 'pathologist', 'is_active',
        'password', 'email', 'phone', 'address', 'gst_number',
        'registration_number', 'signature_url',
    ];

    protected $casts = [
        'technician' => 'array',
        'pathologist' => 'array',
        'is_active' => 'boolean',
    ];

    public function certificates()
    {
        return $this->hasMany(LabCertificate::class);
    }

    public function documents()
    {
        return $this->hasMany(LabDocument::class);
    }

    public function workflows()
    {
        return $this->hasMany(LabWorkflow::class);
    }
}
