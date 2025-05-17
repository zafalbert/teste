<?php

namespace App\Http\Controllers;

use App\Models\Prospections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProspectionsController extends Controller
{
 
public function index()
{
    // Utiliser leftJoin au lieu de join pour inclure toutes les tâches
    $prospection = DB::table('prospections')
        ->leftJoin('contacts', 'prospections.contact_client', '=', 'contacts.id')
        ->leftJoin('second_empyoyers', 'prospections.intervenant', '=', 'second_empyoyers.id')
        ->select(
            'prospections.*',
            'contacts.phone',
            'contacts.nom',
            DB::raw('COALESCE(second_empyoyers.nom, "Monsieur") as nom')
        )
        ->get();

    return response()->json($prospection, 200);
}

    // Créer une nouvelle prospection
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'intitule' => 'required|string',
                'intervenant' => 'required|string',
                'contact_client' => 'required|string',
                'type_action' => 'required|string',
                'montant' => 'required|string',
                'unite' => 'required|string',
                'date_prospection' => 'required|date',
                'source_contact' => 'required|string',
                'prochaine_action' => 'required|string',
                'date_prochaine_action' => 'required|date',
                'date_realisation' => 'nullable|date',
            ]);
    
            // $prospectData = array_merge($validatedData, [
            //     'etat' => ($request->input('intervenant') != 'Monsieur') ? 'En cours' : 'À faire',
            // ]);
            $prospectData = $request->all();
                // Par défaut
                if ($prospectData['intervenant'] != 'Monsieur') {
                    // Si la tâche est déjà réalisée, elle reste "Réalisé"
                    $prospectData['etat'] = 'En cours';
                } else{
                    $prospectData['etat'] = 'A faire';
                }

    
            $prospection = Prospections::create($prospectData);
    
            return response()->json($prospection, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la prospection: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de la prospection',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // Mettre à jour une prospection existante
    public function update(Request $request, $id)
    {
        $prospection = Prospections::findOrFail($id);
    
        $validatedData = $request->validate([
            'etat' => 'required|string',
            'intitule' => 'required|string',
            'intervenant' => 'required|string',
            'contact_client' => 'required|string',
            'type_action' => 'required|string',
            'montant' => 'required|string',
            'unite' => 'required|string',
            'date_prospection' => 'required|string',
            'source_contact' => 'required|string',
            'prochaine_action' => 'required|string',
            'date_prochaine_action' => 'required|string',
            'date_realisation' => 'nullable|date',
        ]);
    
        $prospection->update($validatedData);
    
        $today = now()->format('Y-m-d');
        $isCompleted = $prospection->etat === 'Réalisé' || ($prospection->date_realisation && $today > $prospection->date_realisation);
    
        if (!$isCompleted) {
            $prospection->etat = 'En cours';
            $prospection->date_realisation = null;
        }
    
        if ($request->has('etat') && $request->input('etat') === 'Réalisé' && !$prospection->date_realisation) {
            $prospection->date_realisation = $today;
        }
    
        return response()->json($prospection, 200);
    }
    
    // Supprimer une prospection
    public function destroy($id)
    {
        Prospections::destroy($id);
        return response()->json(null, 204);
    }
}

