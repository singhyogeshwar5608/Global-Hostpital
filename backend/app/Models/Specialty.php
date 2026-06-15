<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    protected $fillable = ['name', 'description', 'icon', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function questions()
    {
        return $this->hasMany(SpecialtyQuestion::class);
    }
}
