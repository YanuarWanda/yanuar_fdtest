<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $users = User::withBasicInfo()
            ->search($request->get('search'))
            ->byStatus($request->get('status'))
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('users/index', [
            'users' => UserResource::collection($users),
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
            ],
        ]);
    }
}
