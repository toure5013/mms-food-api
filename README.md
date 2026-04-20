# 🍽 MMS API — Matin Midi Soir

Backend de la plateforme SaaS **Matin Midi Soir (MMS)**, une solution complète de gestion de restauration collective B2B en Afrique de l'Ouest.

---

## 🚀 Vue d'Ensemble

L'API MMS centralise toute la logique métier de la plateforme, permettant la collaboration entre les entreprises clientes, leurs employés, les cuisiniers et les administrateurs MMS.

### 🌟 Fonctionnalités Clés
- **📦 Multi-tenant** : Gestion isolée des organisations (entreprises clientes).
- **🔐 Authentification Robuste** : JWT sécurisé + système d'OTP par email pour la première connexion et réinitialisation.
- **📅 Gestion de Cantine** : Planification de menus, catalogue de plats avec flags nutritionnels (halal, végétarien, sans sel, etc.).
- **🛒 Commandes & Logistique** : Passation de commandes via mobile, génération de QR Codes pour le retrait.
- **💰 Fintech Intégrée** : Porte-monnaie électronique (`Wallet`) avec recharges via Mobile Money (Wave, Orange, MTN).
- **⭐ Gamification** : Programme de fidélité avec gain de points et classement (Leaderboard).
- **🔔 Notifications Multi-canal** : Alertes Push via Firebase (FCM), emails et notifications in-app.
- **📦 Stockage Cloud** : Gestion des médias via MinIO (compatible S3).

---

## 🛠 Stack Technique
- **Framework** : [NestJS](https://nestjs.com/) (Node.js)
- **Langage** : TypeScript
- **Base de Données** : PostgreSQL avec [TypeORM](https://typeorm.io/)
- **Cache & Queue** : Redis
- **Logging** : Winston (Console, Fichier, Elasticsearch)
- **Documentation** : Swagger / OpenAPI
- **Fichiers** : MinIO
- **Notifications** : Firebase Admin SDK

---

## 📋 Prérequis
- [Node.js](https://nodejs.org/) (v18 ou +)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## ⚡ Installation & Démarrage

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd mms-api
```

### 2. Configuration
Copiez le fichier `.env.example` en `.env` et ajustez les variables (base de données, clés API, etc.).
```bash
cp .env.example .env
```

### 3. Démarrage avec Docker (Recommandé)
Cette commande lance l'API, la base de données PostgreSQL, Redis, MinIO et PGAdmin.
```bash
docker compose up -d
```
L'API sera accessible sur `http://localhost:3001/api/v1`.

### 4. Démarrage Local (Développement)
Si vous souhaitez lancer l'API hors Docker :
```bash
npm install
npm run start:dev
```

---

## 📖 Documentation API

L'API est entièrement documentée via Swagger. Une interface interactive est disponible pour tester les différents endpoints.

- **URL** : `http://localhost:3001/docs`

> [!NOTE]
> La documentation inclut les schémas de données, les codes de réponse (200, 401, 403, etc.) et les permissions requises par rôle.

---

## 🔍 Logging & Monitoring

Le système de logs est configuré via Winston pour être à la fois lisible et exportable.

- **Cibles** : Console (colorée), fichiers rotatifs (`/logs`) et Elasticsearch.
- **Requêtes SQL** : Masquées par défaut pour un terminal propre, activables via `DB_LOG_QUERIES=true`.

---

## 🧪 Tests
```bash
# Tests unitaires
npm run test

# Tests E2E (End-to-End)
npm run test:e2e

# Couverture de code
npm run test:cov
```

---

## 🏗 Architecture des Dossiers
```text
src/
├── auth/           # Authentification & OTP
├── common/         # Decorators, Guards, Interceptors, Logger config
├── database/       # Configuration TypeORM & Custom Logger
├── dishes/         # Gestion du catalogue de plats
├── loyalty/        # Système de points & fidélité
├── menus/          # Planification des menus
├── notifications/  # Logique Push, Email & In-App
├── orders/         # Gestion des commandes & QR Codes
├── organisations/  # Multi-tenancy & Config client
├── payments/       # Webhooks & Mobile Money
├── storage/        # Upload de fichiers (MinIO)
├── users/          # Profils & Rôles
└── wallet/         # Porte-monnaie & Transactions
```

---

## 📄 Licence
Ce projet est la propriété de **Matin Midi Soir**. Tous droits réservés.
