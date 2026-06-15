<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    protected $fillable = [
        'type', 'title', 'description', 'media_url', 'thumbnail_url',
        'redirect_url', 'has_inquiry_button', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'has_inquiry_button' => 'boolean',
        'is_active' => 'boolean',
    ];
}
