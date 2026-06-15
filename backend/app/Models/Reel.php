<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reel extends Model
{
    protected $fillable = [
        'url',
        'title',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
