<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasFactory;

    // Les attributs qui peuvent être remplis en masse
    protected $fillable = [
        'nom', 'prenom', 'email', 'business_email', 'phone',  
        'code_ape', 'typologie', 'entreprise', 'office'
    ];
}

