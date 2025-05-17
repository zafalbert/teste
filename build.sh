#!/usr/bin/env bash

# Installer les dépendances PHP
composer install --no-dev --optimize-autoloader

# Installer les dépendances JS (React)
npm install && npm run build

# Copier .env.example en .env
cp .env.example .env

# Générer la clé d'application Laravel
php artisan key:generate

# Lancer les migrations (optionnel si tu as une DB)
php artisan migrate --force
