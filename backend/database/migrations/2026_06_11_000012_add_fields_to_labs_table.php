<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('labs', function (Blueprint $table) {
            $table->string('email')->nullable()->after('owner_qualification');
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->string('gst_number')->nullable()->after('address');
            $table->string('registration_number')->nullable()->after('gst_number');
            $table->string('signature_url')->nullable()->after('registration_number');
        });
    }

    public function down(): void
    {
        Schema::table('labs', function (Blueprint $table) {
            $table->dropColumn(['email', 'phone', 'address', 'gst_number', 'registration_number', 'signature_url']);
        });
    }
};
