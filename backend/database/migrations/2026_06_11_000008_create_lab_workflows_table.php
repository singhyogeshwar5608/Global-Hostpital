<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_workflows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctors')->nullOnDelete();
            $table->string('test_name');
            $table->text('test_description')->nullable();
            $table->string('sample_status')->default('pending'); // pending, collected, processing, completed
            $table->timestamp('sample_collected_at')->nullable();
            $table->string('report_url')->nullable();
            $table->text('report_notes')->nullable();
            $table->string('status')->default('assigned'); // assigned, sample_pending, in_progress, completed, reviewed
            $table->boolean('reviewed_by_doctor')->default(false);
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_workflows');
    }
};
