<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecondEmpyoyer extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'fonction',
        'adresse',
        'date_prise_poste'
    ];
}
