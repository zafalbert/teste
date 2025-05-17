<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offres extends Model
{
    use HasFactory;

     // Les attributs qui peuvent être remplis en masse
     protected $fillable = [
        'titre', 'prix', 'uniter', 'contenus', 'reference', 'date_de_publication',
    ];
}
