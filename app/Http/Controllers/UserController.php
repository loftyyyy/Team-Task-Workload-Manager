<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function index()
    {
        $query = User::query();
        $query->where('role', 'employee');
        $query->paginate(15);
        $users = $query->get();

        return response()->json($users);
    }
}
