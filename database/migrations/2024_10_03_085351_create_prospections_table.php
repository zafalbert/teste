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
        Schema::create('prospections', function (Blueprint $table) {
            $table->id();
            $table->string('etat'); 
            $table->string('intitule');
            $table->string('intervenant');
            $table->string('contact_client');
            $table->string('type_action')->nullable();
            $table->string('montant')->nullable();
            $table->string('unite');
            $table->string('date_prospection'); // Correction: 'sting' to 'string'
            $table->string('date_realisation')->nullable()->change();
            $table->string('source_contact');
            $table->string('prochaine_action'); // Correction: 'sting' to 'string'
            $table->string('date_prochaine_action');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prospections');
    }
};
