<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prospections extends Model
{
    use HasFactory;

    // Les attributs qui peuvent être remplis en masse
    protected $fillable = [
        'etat','intitule', 'intervenant', 'contact_client','type_action','montant','unite','date_prospection','date_realisation',
        'source_contact','prochaine_action','date_prochaine_action'
    ];
}

