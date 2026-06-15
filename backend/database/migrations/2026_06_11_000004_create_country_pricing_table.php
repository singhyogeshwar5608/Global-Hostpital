<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('country_pricing', function (Blueprint $table) {
            $table->id();
            $table->string('country');
            $table->string('country_code', 2);
            $table->string('currency_code', 3);
            $table->decimal('consultation_fee', 12, 2)->default(0.00);
            $table->decimal('package_markup_percent', 5, 2)->default(0.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('country_pricing');
    }
};
