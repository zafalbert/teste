<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tache extends Model
{
    use HasFactory;

    // Fillable fields for mass assignment
    protected $fillable = [
        'etat',
        'intitule',
        'Intervenant',
        'date_prevus',
        'date_de_realisation',
        'commentaire',
        'numero_contact',
        'lien_angenda',
    ];
}
