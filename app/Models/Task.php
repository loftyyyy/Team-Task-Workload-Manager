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

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('status');
    }

    public function getOverallStatusAttribute(): string
    {
        $freq = $this->users->pluck('pivot.status')->countBy();
        $max = $freq->max();

        $order = ['completed' => 2, 'in_progress' => 1, 'pending' => 0];
        $candidates = $freq->filter(fn ($c) => $c === $max)->keys();

        return $candidates->sort(fn ($a, $b) => $order[$b] <=> $order[$a])->first() ?? 'pending';
    }
}
