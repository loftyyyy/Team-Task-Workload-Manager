<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, int $userId)
    {
        $user = $request->user();
        $target = $user->can('view all task') ? User::findOrFail($userId) : $user;
        $tasks = $user->can('view all task') ? Task::all() : $target->tasks;

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $this->authorize('create task');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $this->authorize('assign task');

        $task = Task::create($validated);
        $task->users()->sync($validated['user_ids']);

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update($validated);

        return response()->json($task);
    }
}
