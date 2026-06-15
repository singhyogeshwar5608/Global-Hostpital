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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('photo')->nullable();
            $table->string('name');
            $table->string('qualification');
            $table->string('degree');
            $table->string('specialty');
            $table->string('experience');
            $table->string('mobile');
            $table->string('email')->unique();
            $table->string('hospital_name');
            $table->string('district');
            $table->string('state');
            $table->string('country');
            $table->text('address');
            $table->decimal('consultancy_fee', 10, 2);
            $table->string('status')->default('active');
            $table->string('password');
            $table->timestamp('last_login')->nullable();
            $table->boolean('is_online')->default(false);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_consultations')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->json('assigned_patient_ids')->nullable();
            $table->json('assigned_lab_ids')->nullable();
            $table->json('assigned_countries')->nullable();
            $table->json('assigned_states')->nullable();
            $table->json('assigned_districts')->nullable();
            $table->json('permissions')->nullable();
            $table->json('profile_visibility')->nullable();
            $table->json('patient_access')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
