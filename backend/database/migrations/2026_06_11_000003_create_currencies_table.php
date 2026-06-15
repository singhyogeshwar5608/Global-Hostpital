<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('country')->unique();
            $table->string('country_code', 2);
            $table->string('currency_name');
            $table->string('currency_code', 3);
            $table->string('currency_symbol', 10);
            $table->decimal('exchange_rate', 12, 4)->default(1.0000);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
