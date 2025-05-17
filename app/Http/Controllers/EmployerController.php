<?php

namespace App\Http\Controllers;

use App\Models\SecondEmpyoyer;

use Illuminate\Http\Request;

class EmployerController extends Controller
{
    //
       // Afficher toutes les prospectives
       public function index()
    {
        return SecondEmpyoyer::all();
    }
  
       // Créer une nouvelle prospection
     public function store(Request $request)
     {
         $employer = SecondEmpyoyer::create($request->all());
         return response()->json($employer, 201);
     }
  
     // Mettre à jour une prospection existante
     public function update(Request $request, $id)
     {
         $employer = SecondEmpyoyer::findOrFail($id);
         $employer->update($request->all());
         return response()->json($employer, 200);
     }
  
     // Supprimer une prospection
     public function destroy($id)
     {
        SecondEmpyoyer::destroy($id);
         return response()->json(null, 204);
     }

}
