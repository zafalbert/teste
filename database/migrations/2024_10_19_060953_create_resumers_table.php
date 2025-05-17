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
        Schema::create('resumers', function (Blueprint $table) {
            $table->id();
            $table->string('intituler');
            $table->string('resumer');
            $table->string('client');
            $table->string('email_client');
            $table->string('source');
            $table->string('date_resumer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resumers');
    }
};
