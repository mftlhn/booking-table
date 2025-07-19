<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'table_id',
        'invoice_number',
        'total_price',
        'tax',
        'subtotal_price',
        'status',
        'booking_start',
        'booking_end',
        'customer_payment',
        'charge',
        'change',
        'canceled_reason',
        'cashier_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }
}
