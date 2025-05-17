<?php

namespace App\Http\Controllers;

use App\Models\Resumer;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResumerController extends Controller
{
    
    public function index()
    {
        // Utiliser leftJoin au lieu de join pour inclure toutes les tâches
        $resumer = DB::table('resumers')
            ->leftJoin('contacts', 'resumers.client', '=', 'contacts.id')
            ->leftJoin('second_empyoyers', 'resumers.email_client', '=', 'second_empyoyers.id')
            ->select(
                'resumers.*',
                'contacts.entreprise',
                'second_empyoyers.email',
            )
            ->get();

        return response()->json($resumer, 200);
    }

     // Créer une nouvelle Resumer
     public function store(Request $request)
     {
         $resumer = Resumer::create($request->all());
         return response()->json($resumer, 201);
     }

       // Mettre à jour une prospection existante
    public function update(Request $request, $id)
    {
        $resumer = Resumer::findOrFail($id);
        $resumer->update($request->all());
        return response()->json($resumer, 200);
    }

    // Supprimer une prospection
    public function destroy($id)
    {
        Resumer::destroy($id);
        return response()->json(null, 204);
    }
 

}
