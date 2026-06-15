<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $fillable = [
        'country', 'country_code', 'currency_name', 'currency_code',
        'currency_symbol', 'exchange_rate', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'exchange_rate' => 'decimal:4',
    ];
}
