<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuImage extends Model
{
    protected $fillable = [
        'menu_id',
        'image_path',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }
}
