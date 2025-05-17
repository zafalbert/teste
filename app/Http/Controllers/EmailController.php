<?php

namespace App\Http\Controllers;

use App\Models\Email;
use Illuminate\Http\Request;
use Google_Client;
use Google_Service_Gmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class EmailController extends Controller
{   
    private $client;
    private $email;

    public function __construct()
    {
        $this->email = config(storage_path('config/google.php'));
        $this->client = new Google_Client();
        $this->client->setAuthConfig(storage_path('app/google/credentials.json'));
        $this->client->setAccessType('offline');
        $this->client->setPrompt('consent');
        $this->client->setScopes([
            Gmail::GOOGLE_EMAIL
        ]);
        
        // Ajout des headers CORS
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Origin: ' . config('app.url'));
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Token-Auth, Authorization');
    }

    private function getOrRefreshToken()
    {
        try {
            $accessToken = Cache::get('gmail_access_token');
            $refreshToken = config('services.google.refresh_token');

            if (!$accessToken) {
                if (empty($refreshToken)) {
                    Log::error('Refresh token manquant');
                    throw new \Exception('Configuration Gmail manquante');
                }

                $this->client->fetchAccessTokenWithRefreshToken($refreshToken);
                $accessToken = $this->client->getAccessToken();
                
                if (isset($accessToken['access_token'])) {
                    Cache::put('gmail_access_token', $accessToken, now()->addMinutes(55));
                } else {
                    throw new \Exception('Token d\'accès invalide');
                }
            }

            $this->client->setAccessToken($accessToken);
            return true;
        } catch (\Exception $e) {
            Log::error('Erreur d\'authentification Gmail: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getEmailStats()
    {
        try {
            Log::info('Début de la récupération des statistiques email');
            
            if (!auth()->check()) {
                return response()->json(['error' => 'Non autorisé'], 401);
            }

            $this->getOrRefreshToken();
            $gmail = new Google_Service_Gmail($this->client);

            $stats = [
                'unread' => $this->getMessageCount($gmail, 'is:unread in:inbox'),
                'received' => $this->getMessageCount($gmail, 'in:inbox -in:spam'),
                'sent' => $this->getMessageCount($gmail, 'in:sent'),
                'deleted' => $this->getMessageCount($gmail, 'in:trash'),
                'timestamp' => now()->toISOString()
            ];

            Log::info('Statistiques récupérées avec succès', $stats);
            return response()->json($stats);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la récupération des statistiques email',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    private function getMessageCount($gmail, $query)
    {
        try {
            $response = $gmail->users_messages->listUsersMessages($this->email, [
                'q' => $query,
                'maxResults' => 500 // Limite pour éviter les timeouts
            ]);
            return $response->getMessages() ? count($response->getMessages()) : 0;
        } catch (\Exception $e) {
            Log::error("Erreur lors du comptage des messages ($query): " . $e->getMessage());
            return 0;
        }
    }
}