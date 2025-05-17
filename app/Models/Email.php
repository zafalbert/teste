<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    use HasFactory;

    protected $fillable = [
        'email_address',
        'subject',
        'content',
        'status', // 'read', 'unread', 'sent', 'deleted'
        'type',   // 'received', 'sent'
        'sender',
        'recipient',
        'read_at',
        'deleted_at'
    ];
    
    protected $casts = [
        'read_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];
}
