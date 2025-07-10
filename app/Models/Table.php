<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $fillable = [
        'name',
    ];

    /**
     * Get the transactions associated with the table.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
