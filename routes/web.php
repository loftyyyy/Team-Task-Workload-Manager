<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/tasks/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::inertia('tasks/dashboard', 'tasks/dashboard')->name('tasks.dashboard');
Route::inertia('tasks/my-work', 'tasks/my-work')->name('tasks.my-work');

require __DIR__.'/settings.php';
