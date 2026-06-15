<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CountryPricing extends Model
{
    protected $fillable = [
        'country', 'country_code', 'currency_code',
        'consultation_fee', 'package_markup_percent', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
