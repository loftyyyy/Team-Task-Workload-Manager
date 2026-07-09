<?php

use Illuminate\Support\Facades\Route;

Route::get('/users', []);

Route::post('/tasks', []);

Route::get('my-tasks/{userId}', []);
