<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserController::class, 'index']);

Route::post('/tasks', [TaskController::class, 'store']);

Route::get('my-tasks/{userId}', [TaskController::class, 'index']);

Route::patch('/tasks/{id}/status', [TaskController::class, 'update']);
