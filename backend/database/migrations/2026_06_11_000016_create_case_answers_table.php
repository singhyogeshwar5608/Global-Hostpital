<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_submission_id')->constrained()->onDelete('cascade');
            $table->foreignId('specialty_question_id')->constrained()->onDelete('cascade');
            $table->string('answer');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_answers');
    }
};
