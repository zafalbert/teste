# Étape 1 : Builder (Composer + Node.js via NodeSource)
FROM php:8.2-bullseye AS build

# Installer curl et autres outils nécessaires
RUN apt-get update && apt-get install -y curl unzip git gnupg

# Installer Node.js depuis NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de ton projet
COPY . .

# Installer les dépendances Laravel + React
RUN composer install --no-dev --optimize-autoloader && \
    npm install && npm run build

---

# Étape 2 : Runtime - Apache avec PHP
FROM php:8.2-apache

RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite

# Copier le projet depuis l'étape build
COPY --from=build /app /var/www/html

WORKDIR /var/www/html

# Définir les droits d'accès
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["apache2-foreground"]
