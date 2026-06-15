<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthPackage extends Model
{
    protected $fillable = [
        'name', 'description', 'benefits', 'price', 'original_price',
        'category', 'duration', 'tests_included', 'image', 'is_active',
    ];

    protected $casts = [
        'benefits' => 'array',
        'tests_included' => 'array',
        'is_active' => 'boolean',
    ];
}
