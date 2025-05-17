<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureFrontendRequestsAreStateful
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Vérifiez si la requête doit être traitée comme une requête stateful
        if ($request->expectsJson() || $request->is('api/*')) {
            return $next($request);
        }

        // Authentifier l'utilisateur à partir des cookies
        if ($request->hasHeader('X-XSRF-TOKEN') && $request->session()->has('laravel_session')) {
            // Effectuer l'authentification ici
        }

        return $next($request);
    }
}
