<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabDocument extends Model
{
    protected $fillable = [
        'lab_id', 'document_type', 'document_name', 'file_url',
        'gst_number', 'is_verified',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function lab()
    {
        return $this->belongsTo(Lab::class);
    }
}
