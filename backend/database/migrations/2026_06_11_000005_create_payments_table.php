<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->morphs('payable');
            $table->foreignId('patient_id')->nullable()->constrained()->nullOnDelete();
            $table->string('payment_type'); // consultation, package, medicine
            $table->decimal('amount', 12, 2);
            $table->string('currency_code', 3)->default('USD');
            $table->string('payment_method')->nullable(); // card, upi, insurance, cash
            $table->string('payment_status')->default('pending'); // pending, completed, failed, refunded
            $table->string('transaction_id')->nullable()->unique();
            $table->json('payment_details')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
