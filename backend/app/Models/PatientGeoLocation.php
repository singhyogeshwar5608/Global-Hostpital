<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientGeoLocation extends Model
{
    protected $fillable = [
        'patient_id', 'ip_address', 'country', 'country_code',
        'state', 'city', 'latitude', 'longitude',
        'currency_code', 'currency_symbol',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
