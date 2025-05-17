<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class devisOffres extends Model
{
    use HasFactory;

     // Les attributs qui peuvent être remplis en masse
     protected $fillable = [
        'reference', 'objet', 'client', 'adresse', 'pays', 'code', 
        'designation', 'quantiter', 'prix_unitaire', 'montant', 'unite', 'date'
    ];
}
