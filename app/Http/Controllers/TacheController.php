<?php

namespace App\Http\Controllers;

use App\Models\Tache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TacheController extends Controller
{
    public function index()
    {
        // Utiliser leftJoin au lieu de join pour inclure toutes les tâches
        $taches = DB::table('taches')
            ->leftJoin('contacts', 'taches.numero_contact', '=', 'contacts.id')
            ->leftJoin('second_empyoyers', 'taches.Intervenant', '=', 'second_empyoyers.id')
            ->select(
                'taches.*',
                'contacts.phone',
                'contacts.nom',
                DB::raw('COALESCE(second_empyoyers.nom, "Tâche non effectuée") as nom')
            )
            ->get();

        return response()->json($taches, 200);
    }

    public function store(Request $request)
{
    // Valider les données entrantes
    $request->validate([
        'intitule' => 'required|string',
        'Intervenant' => 'required|string',
        'date_prevus' => 'required|date',
        'commentaire' => 'required|string',
        'lien_angenda' => 'nullable|string',
        'numero_contact' => 'required|string',
    ]);

    
    // Définir l'état initial à 'En cours'
    $tacheData = $request->all();
      // Par défaut
    if ($tacheData['Intervenant'] != 'Tâche non effectuée') {
        // Si la tâche est déjà réalisée, elle reste "Réalisé"
        $tacheData['etat'] = 'En cours';
    } else{
        $tacheData['etat'] = 'A faire';
    }

    

    // Créer la nouvelle tâche
    $tache = Tache::create($tacheData);

    return response()->json($tache, 201); // Réponse avec un code 201 (créé)
}

public function update(Request $request, $id)
{
    $tache = Tache::findOrFail($id);

    $validatedData = $request->validate([
        'etat' => 'required|string',
        'intitule' => 'required|string',
        'Intervenant' => 'required|string',
        'commentaire' => 'required|string',
        'date_prevus' => 'required|date',
        'date_de_realisation' => 'nullable|date',
        'lien_angenda' => 'nullable|string',
        'numero_contact' => 'required|string',
    ]);

    $tache->update($validatedData);

    // Gestion de l'état et de la date de réalisation
    $today = now()->format('Y-m-d');
    $isCompleted = $tache->etat === 'Réalisé' || ($tache->date_de_realisation && $today > $tache->date_de_realisation);

    if (!$isCompleted) {
        $tache->etat = 'En cours';
        $tache->date_de_realisation = null;
    }

    if ($request->has('etat') && $request->etat === 'Réalisé' && !$tache->date_de_realisation) {
        $tache->date_de_realisation = $today;
    }

    return response()->json($tache, 200);
}

            // Méthode pour supprimer une tâche
    public function destroy($id)
    {
        $tache = Tache::findOrFail($id);
        $tache->delete();

        return response()->json(['message' => 'Tâche supprimée avec succès'], 200); // Réponse avec un code 200
    }




}
