<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmailController; // Assurez-vous d'avoir le bon controller

// Vos autres routes API...

//Route::middleware(['auth:sanctum'])->group(function () {
    //Route::get('/email-stats', [EmailController::class, 'getEmailStats']);
//});
//Route::get('/email-stats', [EmailController::class, 'getEmailStats']);

Route::middleware(['api','auth:sanctum'])->group(function () {

    Route::get('HistoriqueEmail', [EmailController::class, 'getEmailStats']); 
});