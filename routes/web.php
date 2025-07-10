<?php

use App\Http\Controllers\AdminTransactionController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FamilyController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Middleware\RoleMiddleware as SpatieRoleMiddleware;

// use Spatie\Permission\Middleware\RoleMiddleware;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::get('/', [HomePageController::class, 'index'])->name('home');
Route::get('/login', [AuthenticatedSessionController::class, 'create']);

// Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->middleware(['auth', 'verified'])->name('dashboard');
    
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/cart', [TransactionController::class, 'cart'])->name('cart');
    Route::post('/transaction', [TransactionController::class, 'storeTransaction'])->name('transaction.store');
    Route::post('/check-available-tables', [TransactionController::class, 'checkAvailableTables']);
    Route::post('/transaction/update-confirmed', [TransactionController::class, 'updateConfirmedTransaction']);
    Route::get('/transaction/{id}', [TransactionController::class, 'getTransactionHistory']);

    Route::prefix('/admin')->middleware(RoleMiddleware::class)->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Menu Management
        Route::controller(MenuController::class)->middleware(SpatieRoleMiddleware::class . ':admin')->group(function () {
            Route::get('/menus', 'index')->name('menus.index');
            Route::post('/menus/store', 'store')->name('menus.store');
            Route::post('/menus/{id}/update', 'update')->name('menus.update');
            Route::post('/menus/toggle', 'toggleActive')->name('menus.toggle');
            Route::post('/menus/image/{id}/delete', 'deleteImage')->name('menus.deleteImage');
        });

        // User Management
        Route::controller(UserController::class)->middleware(SpatieRoleMiddleware::class . ':admin')->group(function () {
            Route::get('/users', 'index')->name('users.index');
            Route::post('/users/store', 'store')->name('users.store');
        });

        Route::controller(AdminTransactionController::class)->middleware(SpatieRoleMiddleware::class . ':kasir')->group(function () {
            Route::get('/transactions', 'index')->name('transactions.index');
            Route::post('/transactions/cashier-pay', 'pay')->name('cashier.pay');
            Route::post('/transactions/cashier-cancel', 'cancel')->name('cashier.cancel');
        });

        Route::controller(TableController::class)->middleware(SpatieRoleMiddleware::class . ':admin')->group(function () {
            Route::get('/tables', 'index')->name('tables.index');
            Route::post('/tables', 'store')->name('tables.store');
        });
    });
});

require __DIR__.'/auth.php';
