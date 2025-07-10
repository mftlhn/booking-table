<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::get();

        return Inertia::render('Table/Index', compact('tables'));
    }

    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            Table::create($request->all());
        });

        return back()->with('success', 'Meja berhasil ditambahkan!');
    }
}
