<?php
 header('Access-Control-Allow-Credentials: true');
 header('Access-Control-Allow-Origin: *' );
 header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
 header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Token-Auth, Authorization, X-CSRF-Token');





use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());
