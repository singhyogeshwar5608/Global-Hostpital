<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    protected $fillable = [
        'name', 'price', 'stock', 'description', 'quantity', 'category',
        'image', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
