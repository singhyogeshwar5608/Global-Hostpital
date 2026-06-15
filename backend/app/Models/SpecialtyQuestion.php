<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialtyQuestion extends Model
{
    protected $fillable = ['specialty_id', 'question', 'question_type', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function specialty()
    {
        return $this->belongsTo(Specialty::class);
    }
}
