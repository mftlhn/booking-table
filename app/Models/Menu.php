<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = [
        'name',
        'category',
        'price',
        'is_active',
        'description',
    ];

    public function images()
    {
        return $this->hasMany(MenuImage::class);
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
