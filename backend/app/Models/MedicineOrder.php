<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineOrder extends Model
{
    protected $fillable = [
        'items', 'total_amount', 'patient_name', 'patient_email',
        'patient_phone', 'shipping_address', 'payment_method',
        'payment_status', 'order_status',
    ];

    protected $casts = [
        'items' => 'array',
    ];
}
