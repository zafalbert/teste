<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_path',
        'type',
        'client_proprietaire',
        'date_document',
        
    ];

    protected $dates = [
        'date_document',
    ];
}
