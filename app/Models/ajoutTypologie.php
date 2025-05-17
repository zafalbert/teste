<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ajoutTypologie extends Model
{
    use HasFactory;
    protected $fillable = [
        'typologie', 'entreprise'
    ];
}
