<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|max:255',
            'entreprise' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'role' => $validatedData['role'],
            'entreprise' => $validatedData['entreprise'],
            'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password,
        ]);


    
        return response()->json($user, 201);
    }


    public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,  // Correction ici
        'role' => 'required|string|max:255',
        'entreprise' => 'required|string|max:255',
        'password' => 'sometimes|nullable|string|min:8',  // Validation optionnelle pour le mot de passe
    ]);

    // Mise à jour de l'utilisateur avec les données validées
    $user->update([
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'role' => $validatedData['role'],
        'entreprise' => $validatedData['entreprise'],
        'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password,
    ]);

    return response()->json($user);
}


    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
}
