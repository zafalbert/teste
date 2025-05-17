<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resumer extends Model
{
    use HasFactory;

    protected $fillable = [
        'intituler',
        'resumer',
        'client',
        'email_client',
        'source',
        'type_source',
        'date_resumer',
    ];

}
