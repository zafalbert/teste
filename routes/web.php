<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TypologieController;
use App\Http\Controllers\TacheController;
use App\Http\Controllers\ProspectionsController;
use App\Http\Controllers\DevisController;
use App\Http\Controllers\OffresController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ResumerController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\Auth\ForgotPasswordController;

// Routes API
Route::get('/HistoriqueEmail', [EmailController::class, 'getEmailStats']);
Route::post('/login', [AuthController::class, 'post_login']);
Route::get('/Utilisateurs', [UtilisateurController::class, 'index']);
Route::post('/Utilisateurs', [UtilisateurController::class, 'store']);
Route::put('/Utilisateurs/{id}', [UtilisateurController::class, 'update']);
Route::delete('/Utilisateurs/{id}', [UtilisateurController::class, 'destroy']);
Route::apiResource('/contacts', ContactController::class);
Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
Route::apiResource('/ajout_typologie', TypologieController::class);
Route::get('/Taches', [TacheController::class, 'index']);
Route::post('/Taches', [TacheController::class, 'store']);
Route::put('/Taches/{id}', [TacheController::class, 'update']);
Route::delete('/Taches/{id}', [TacheController::class, 'destroy']);
Route::apiResource('/Prospections', ProspectionsController::class);
Route::apiResource('/Devis', DevisController::class);
Route::apiResource('/Offres', OffresController::class);
Route::post('/Document', [DocumentController::class, 'store']);
Route::put('/Document/{id}', [DocumentController::class, 'update']);
Route::delete('/Document/{id}', [DocumentController::class, 'destroy']);
Route::get('/Document/{id}', [DocumentController::class, 'download']);
Route::get('/Document', [DocumentController::class, 'index']);
Route::apiResource('/Resumer', ResumerController::class);
Route::get('/Employer', [EmployerController::class, 'index']);
Route::get('/Employer/{id}', [EmployerController::class, 'show']);
Route::post('/Employer', [EmployerController::class, 'store']);
Route::put('/Employer/{id}', [EmployerController::class, 'update']);
Route::delete('/Employer/{id}', [EmployerController::class, 'destroy']);

// IMPORTANT: Routes d'authentification en dehors du middleware auth
Route::get('/login', function () {
    return view('welcome');
})->name('login');

Route::get('/forgot_password', function() {
    return view('welcome');
});

Route::get('/forgot-password', function () {
    return view('welcome');
});

Route::get('/reset-password', function () {
    return view('welcome');
});

// Routes protégées par auth
Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });

    Route::get('/Accueil', function () {
        return view('welcome');
    });
    
    Route::get('/GestionDeTache', function () {
        return view('welcome');
    });

    Route::get('/GestionProspection', function () {
        return view('welcome');
    });

    Route::get('/GestionOffre', function () {
        return view('welcome');
    });
    
    Route::get('/GestionDeDevis', function () {
        return view('welcome');
    });
    
    Route::get('/GererOffre', function () {
        return view('welcome');
    });
    
    Route::get('/GestionDeDocument', function () {
        return view('welcome');
    });
    
    Route::get('/SuivieInteraction', function () {
        return view('welcome');
    });

    Route::get('/HistoriqueAppel', function () {
        return view('welcome');
    });

    Route::get('/Rapport', function () {
        return view('welcome');
    });

    Route::get('/GestionEmployer', function () {
        return view('welcome');
    });

    Route::get('/GestionUtilisateur', function () {
        return view('welcome');
    });

    // Route supplémentaire pour /HistoriqueEmail vue
    Route::get('/HistoriqueEmail', function () {
        return view('welcome');
    });
});