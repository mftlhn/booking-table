<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // if (! $request->user() || ! $request->user()->hasRole($role)) {
        //     abort(403, 'Not allowed');
        // }
        $user = Auth::user();

        if ($user && $user->hasRole('customer')) {
            abort(403, 'Access denied.');
        }
        return $next($request);
    }
}
