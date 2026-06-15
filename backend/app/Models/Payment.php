<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'payable_type', 'payable_id', 'patient_id', 'payment_type',
        'amount', 'currency_code', 'payment_method', 'payment_status',
        'transaction_id', 'payment_details', 'paid_at',
    ];

    protected $casts = [
        'payment_details' => 'array',
        'paid_at' => 'datetime',
    ];

    public function payable()
    {
        return $this->morphTo();
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
