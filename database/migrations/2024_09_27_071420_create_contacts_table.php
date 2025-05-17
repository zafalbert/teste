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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // Changed 'Nom' to 'nom'
            $table->string('prenom');
            $table->string('email');
            $table->string('business_email');
            $table->string('phone')->nullable();
            $table->string('code_ape'); // Changed to 'code_ape' and type string
            $table->string('typologie');
            $table->string('entreprise');
            $table->string('office');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
