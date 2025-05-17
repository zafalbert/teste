<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function post_login(Request $request)
    {
        Log::info('Tentative de connexion', $request->all());

       // $token = $request->header('X-CSRF-TOKEN');

        /*if (!Hash::check($request->input('password'), User::find(1)->password) ||
        !hash_equals($token, csrf_token())) {
        return response('Unauthorized.', 401);
        }*/

        try {
            // Validate incoming request data
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            Log::info('Données validées', $validated);

            $remember = !empty($request->remember);

            if (Auth::attempt(['email' => $request->email, 'password' => $request->password], $remember)) {
                Log::info('Connexion réussie pour l\'utilisateur: ' . $request->email);
                return response()->json([
                    'status' => true,
                    'message' => 'Bienvenu, tu es connecté'
                ]);
            } else {
                Log::warning('Échec de connexion pour l\'email: ' . $request->email);
                return response()->json([
                    'status' => false,
                    'message' => 'Vérifiez vos informations de connexion'
                ], 401);
            }

        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Données invalides',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la tentative de connexion : ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Une erreur est survenue. Veuillez réessayer plus tard.'
            ], 500);
        }
    }
}
