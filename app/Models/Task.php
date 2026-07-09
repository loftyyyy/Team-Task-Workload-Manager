<?php

namespace App\Models;

use App\Enums\Status;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(
    'title',
    'description',
    'status'
)]
class Task extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => Status::class,
        ];
    }
}
