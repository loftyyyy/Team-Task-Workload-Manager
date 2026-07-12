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
            $tasks = Task::with('users')->get()->each(function ($task) {
                $task->overall_status = $task->overall_status;
            });
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

    // user_id is passed explicitly here because the assessment brief
    // mocks authentication via a View-as toggle rather than real session
    // auth — the endpoint needs to know which user's pivot row to update.
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
            'user_id' => 'required|exists:users,id',
        ]);

        $task->users()->updateExistingPivot($validated['user_id'], [
            'status' => $validated['status'],
        ]);

        return response()->json($task->load('users'));
    }
}
