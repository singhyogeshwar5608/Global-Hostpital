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
        Schema::create('labs', function (Blueprint $table) {
            $table->id();
            $table->string('lab_name');
            $table->string('district');
            $table->string('state');
            $table->string('country');
            $table->string('owner_name');
            $table->string('owner_qualification');
            $table->json('technician')->nullable();
            $table->json('pathologist')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('labs');
    }
};
