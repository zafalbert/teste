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
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->string('etat'); 
            $table->string('intitule');
            $table->string('Intervenant');
            $table->string('date_prevus');
            $table->string('date_de_realisation')->nullable();
            $table->string('lien_angenda')->nullable();
            $table->string('numero_contact'); // Correction: 'sting' to 'string'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taches');
    }
};
