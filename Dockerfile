# Étape 1 : build avec Composer + Node.js
FROM php:8.2-bullseye AS build


WORKDIR /app

# Copier tous les fichiers
COPY . .

# Installer Node.js et dépendances JS
RUN apt-get update && apt-get install -y nodejs npm && \
    composer install --no-dev --optimize-autoloader && \
    npm install && npm run build

# Étape 2 : Apache + PHP runtime
FROM php:8.2-apache

# Installer extensions PHP requises
RUN docker-php-ext-install pdo pdo_mysql

# Activer mod_rewrite pour Laravel
RUN a2enmod rewrite

# Copier le projet compilé depuis l'étape précédente
COPY --from=build /app /var/www/html

WORKDIR /var/www/html

# Définir les permissions Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installer Node.js + npm
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs


CMD ["apache2-foreground"]
