<?php

namespace App\Http\Controllers;

use App\Models\Document;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DocumentController extends Controller
{
  
    public function index()
    {
        // Utiliser leftJoin au lieu de join pour inclure toutes les tâches
        $document = DB::table('documents')
            ->leftJoin('contacts', 'documents.client_proprietaire', '=', 'contacts.id')
            ->select(
                'documents.*',
                'contacts.nom',
            )
            ->get();

        return response()->json($document, 200);
    }
       // Créer une nouvelle prospection
       public function store(Request $request)
{
    $validatedData = $request->validate([
        'file' => 'required|file|mimes:pdf,docx,jpg,jpeg,png,doc,txt,php,zip,odt|max:2048',
        'type' => 'required|string|max:255',
        'client_proprietaire' => 'required',
        'date_document' => 'required|date',
    ]);

    try {
        if ($request->hasFile('file')) {
            // Récupérer le nom original du fichier
            $originalFileName = $request->file('file')->getClientOriginalName();
            
            // Stocker le fichier avec son nom original
            $filePath = $request->file('file')->storeAs('Document', $originalFileName, 'resources_js');

            $document = new Document();
            $document->file_path = $originalFileName; // Stocker le nom original
            $document->type = $validatedData['type'];
            $document->client_proprietaire = $validatedData['client_proprietaire'];
            $document->date_document = $validatedData['date_document'];
            $document->save();

            return response()->json($document, 201);
        }

        return response()->json(['error' => 'Aucun fichier n\'a été téléchargé'], 422);
    } catch (\Exception $e) {
        Log::error('Erreur lors de l\'ajout du document : ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

       public function update(Request $request, $id)
       {
           // Règles de validation de base
           $rules = [
               'type' => 'required|string|max:255',
               'client_proprietaire' => 'required',
               'date_document' => 'required|date',
           ];
   
           // Ajouter la validation du fichier seulement s'il est présent
           if ($request->hasFile('file')) {
               $rules['file'] = 'file|mimes:pdf,docx,jpg,jpeg,png,doc,txt,php,zip,odt|max:2048';
           }
   
           $validatedData = $request->validate($rules);
   
           try {

            $originalFileName = $request->file('file')->getClientOriginalName();
            
            // Stocker le fichier avec son nom original
            $filePath = $request->file('file')->storeAs('Document', $originalFileName, 'resources_js');
            $document = Document::findOrFail($id);
   
               if ($request->hasFile('file')) {
                   // Supprimer l'ancien fichier
                   if ($document->file_path) {
                       Storage::disk('public')->delete($document->file_path);
                   }
                   $document->file_path = $request->file('file')->store('documents', 'public');
               }
   
               $document->type = $validatedData['type'];
               $document->file_path = $originalFileName; 
               $document->client_proprietaire = $validatedData['client_proprietaire'];
               $document->date_document = $validatedData['date_document'];
               $document->save();
   
               return response()->json($document, 200);
           } catch (\Exception $e) {
               Log::error('Erreur lors de la mise à jour du document : ' . $e->getMessage());
               return response()->json(['error' => $e->getMessage()], 500);
           }
       }

       public function download($id)
       {
           try {
               $document = Document::findOrFail($id);
               
               // Chemin complet du fichier
               $filePath = resource_path('js/Document/Document/' . $document->file_path);
               
               // Vérifier si le fichier existe
               if (!file_exists($filePath)) {
                   return response()->json(['error' => 'Fichier non trouvé'], 404);
               }
       
               // Retourner le fichier en téléchargement
               return response()->download($filePath, $document->file_path);
           } catch (\Exception $e) {
               return response()->json(['error' => $e->getMessage()], 500);
           }
       }
       


     // Supprimer une prospection
     public function destroy($id)
     {
         Document::destroy($id);
         return response()->json(null, 204);
     }
}
