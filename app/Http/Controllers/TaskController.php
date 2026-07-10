<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = User::findOrFail($request->input('user_id'));

        if ($user->can('view all task')) {
            $tasks = Task::with('users')->get();
        } else {
            $tasks = $user->tasks()->with('users')->get();
        }

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $user = User::findOrFail($request->input('user_id'));

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $task = Task::create($validated);
        $task->users()->sync($validated['user_ids']);

        return response()->json($task->load('users'), 201);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update($validated);

        return response()->json($task->load('users'));
    }
}
