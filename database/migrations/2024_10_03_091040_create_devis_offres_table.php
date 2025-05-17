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
        Schema::create('devis_offres', function (Blueprint $table) {
            $table->id();
            $table->string('reference'); 
            $table->string('objet');
            $table->string('client');
            $table->string('adresse');
            $table->string('pays');
            $table->string('code')->nullable();
            $table->string('designation')->nullable();
            $table->string('quantiter'); // Correction: 'sting' to 'string'
            $table->string('prix_unitaire');
            $table->string('montant'); // Correction: 'sting' to 'string'
            $table->string('unite');
            $table->string('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devis_offres');
    }
};
