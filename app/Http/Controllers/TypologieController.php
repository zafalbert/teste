<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ajoutTypologie;

class TypologieController extends Controller
{
    public function store(Request $request)
    {
        // Validation des données envoyées depuis le formulaire
        $validatedData = $request->validate([
            'typologie' => 'required|string|max:255',
            'entreprise' => 'required|string|max:255',
            
        ]);

        // Création du nouveau contact
        $typologie = ajoutTypologie::create($validatedData);

        // Retourner une réponse JSON
        return response()->json(['message' => 'Contact ajouté avec succès!', 'contact' => $typologie], 201);
    }

}
