<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Contact::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données envoyées depuis le formulaire
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'business_email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            'code_ape' => 'required|string|max:255',
            'typologie' => 'required|string|max:255',
            'entreprise' => 'required|string|max:255',
            'office' => 'required|string|max:255',
        ]);

        // Création du nouveau contact
        $contact = Contact::create($validatedData);

        // Retourner une réponse JSON
        return response()->json(['message' => 'Contact ajouté avec succès!', 'contact' => $contact], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
{
    // Validation des données envoyées
    $validatedData = $request->validate([
        'nom' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'business_email' => 'required|email|max:255',
        'phone' => 'required|string|max:15',
        'code_ape' => 'required|string|max:255',
        'typologie' => 'required|string|max:255',
        'entreprise' => 'required|string|max:255',
        'office' => 'required|string|max:255',
    ]);

    // Mise à jour du contact
    $contact->update($validatedData);

    // Retourner une réponse de succès
    return response()->json(['message' => 'Contact mis à jour avec succès!', 'contact' => $contact]);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
{
    // Supprimer le contact
    $contact->delete();

    // Retourner une réponse de succès
    return response()->json(['message' => 'Contact supprimé avec succès!']);
}

}
