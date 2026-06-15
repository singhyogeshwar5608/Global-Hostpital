<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patient_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('package_id')->nullable();
            $table->string('package_name')->nullable();
            $table->decimal('package_price', 10, 2)->nullable();
            $table->string('patient_name');
            $table->string('patient_email');
            $table->string('patient_phone');
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->nullable();
            $table->string('booking_status')->nullable();
            $table->string('meeting_link')->nullable();
            $table->string('doctor_id')->nullable();
            $table->string('doctor_name')->nullable();
            $table->timestamp('appointment_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_bookings');
    }
};
