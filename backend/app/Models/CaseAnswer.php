<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseAnswer extends Model
{
    protected $fillable = ['case_submission_id', 'specialty_question_id', 'answer'];

    public function caseSubmission()
    {
        return $this->belongsTo(CaseSubmission::class);
    }

    public function question()
    {
        return $this->belongsTo(SpecialtyQuestion::class, 'specialty_question_id');
    }
}
