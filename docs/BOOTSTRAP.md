# MMS Cantine — Bootstrap & Init App

Ce document décrit tout ce qui a été mis en place pour initialiser l'application en production via l'API.

---

## 1. Endpoint Bootstrap

### `POST /bootstrap`

Point d'entrée unique pour initialiser la base de données et les données de départ.

**Pas de token JWT requis.** Protégé uniquement par le `BOOTSTRAP_SECRET`.

#### Corps de la requête

```json
{
  "secret": "ton-code-secret",
  "runMigrations": true
}
```

| Champ | Type | Description |
|---|---|---|
| `secret` | `string` | Doit correspondre à `BOOTSTRAP_SECRET` dans `.env` |
| `runMigrations` | `boolean` | `true` → exécute les migrations TypeORM avant le seed |

#### Réponse (200)

```json
{
  "success": true,
  "steps": [
    "migrations: 1 exécutée(s) — InitialSchema1750464000000",
    "patch junction: order_dishes ✓, menu_dishes ✓",
    "settings: créé",
    "organisations: 5 créée(s), 0 ignorée(s)",
    "utilisateurs: 8 créé(s), 0 ignoré(s)",
    "plats: 57 créé(s), 0 ignoré(s)",
    "menus: 14 créé(s), 0 ignoré(s)"
  ]
}
```

#### Erreurs

| Code | Raison |
|---|---|
| `401` | Secret invalide ou `BOOTSTRAP_SECRET` non défini en env |

#### Idempotence

L'endpoint est **idempotent** — il peut être appelé plusieurs fois sans risque. Les entités déjà présentes en base sont ignorées (pas d'écrasement).

---

## 2. Variable d'environnement requise

Ajouter dans `.env` (et `.env.prod`) :

```env
BOOTSTRAP_SECRET=change-this-to-a-strong-secret
```

Choisir un secret fort (min. 32 caractères) — il ne sera jamais exposé dans les logs ni les réponses.

---

## 3. Fichiers créés / modifiés

### Nouveaux fichiers

| Fichier | Rôle |
|---|---|
| `src/admin/bootstrap.controller.ts` | Contrôleur `POST /bootstrap` (public) |
| `src/admin/bootstrap.service.ts` | Logique complète de seed |
| `src/admin/bootstrap.dto.ts` | DTO de validation (`secret`, `runMigrations`) |
| `src/admin/admin.controller.ts` | Routes DB admin (SUPER_ADMIN uniquement) |
| `src/admin/admin.module.ts` | Module NestJS regroupant tout l'admin |
| `docs/patch-junction-columns.sql` | Script SQL de correction des colonnes junction |
| `docs/init-schema.sql` | Schéma complet pgAdmin-ready avec seed |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/app.module.ts` | Import `AdminModule` + chemin migrations dans TypeORM config |
| `src/orders/order.entity.ts` | `@JoinTable` explicite (camelCase) sur `order_dishes` |
| `src/menus/menu.entity.ts` | `@JoinTable` explicite (camelCase) sur `menu_dishes` |
| `src/users/dto/users.dto.ts` | Champ `password` ajouté à `UpdateUserDto` |
| `src/users/users.service.ts` | `update()` gère le reset de mot de passe |
| `.env.example` | Ajout de `BOOTSTRAP_SECRET` |

---

## 4. Routes admin DB (SUPER_ADMIN requis)

Ces routes nécessitent un token JWT valide avec le rôle `SUPER_ADMIN`.

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/admin/db/migrations/pending` | Vérifie s'il y a des migrations en attente |
| `POST` | `/admin/db/migrations/run` | Exécute toutes les migrations en attente |
| `POST` | `/admin/db/patch/junction-columns` | Corrige les colonnes snake_case → camelCase (idempotent) |

---

## 5. Données seedées

### Organisations (5)

| ID | Slug | Nom | Subvention |
|---|---|---|---|
| `f51ac2c8-...` | `togoom-corp` | TOGOOM CORP | FIXED 10 000 FCFA |
| `b0f44923-...-e2` | `nsia-banque` | NSIA Banque | FIXED 1 500 FCFA |
| `a0eebc99-...` | `demo-sarl` | Entreprise Demo SARL | FIXED 10 000 FCFA |
| `b0f44923-...-e1` | `orange-ci` | Orange Côte d'Ivoire | PERCENTAGE 50% |
| `b0f44923-...-e4` | `cie-sodeci` | CIE-SODECI | FULL |

### Utilisateurs (8)

> Mot de passe par défaut de tous les comptes seed : **`password`**

| Email | Rôle | Organisation |
|---|---|---|
| `admin@super.ci` | `SUPER_ADMIN` | — |
| `moussa.serveur@tog.ci` | `ADMIN_MMS` | TOGOOM CORP |
| `chef@mms.ci` | `COOK` | TOGOOM CORP |
| `awa@nsia.ci` | `ADMIN_CLIENT` | NSIA Banque |
| `admin@demo.ci` | `ADMIN_CLIENT` | Entreprise Demo SARL |
| `koffi@demo.ci` | `EMPLOYEE` | Entreprise Demo SARL |
| `admin@tog.ci` | `ADMIN_CLIENT` | TOGOOM CORP |
| `koffi@orange.ci` | `EMPLOYEE` | Orange Côte d'Ivoire |

### Plats (57)

Tous sans organisation rattachée (catalogue commun), actifs.

| Catégorie | Nb | Exemples |
|---|---|---|
| `ENTREE` | 10 | Salade composée, Avocat crevettes, Carottes râpées, Samoussas... |
| `RESISTANCE` | 20 | Riz gras poulet, Attiéké poisson, Garba, Poulet braisé, Yassa poulet, Tchep... |
| `DESSERT` | 8 | Tiramisu, Glace vanille, Crêpes, Gâteau chocolat, Yaourt nature... |
| `BOISSON` | 8 | Jus d'orange, Jus de bissap, Eau minérale, Smoothie mangue... |
| `CAFE` | 4 | Espresso, Café latte, Cappuccino, Thé |
| Héritage (sans catégorie) | 7 | Attiéké Poisson Grillé, Foutou Sauce Graine, Garba Royal, Poulet Braisé... |

### Menus (14)

7 jours glissants à partir du jour du bootstrap, créneau `NOON`, publiés (`is_published: true`).

| Organisation | Jours |
|---|---|
| NSIA Banque | J+0 → J+6 (7 menus) |
| TOGOOM CORP | J+0 → J+6 (7 menus) |

Chaque menu contient 5-6 plats (1 entrée + 2 résistances + 1 dessert + 1-2 boissons).

### Settings (1)

Configuration par défaut de l'application.

```json
{
  "general":  { "appName": "MMS Cantine", "timezone": "Africa/Abidjan", "language": "fr", "currency": "FCFA" },
  "branding":  { "primaryColor": "#E87722", "secondaryColor": "#1A1A2E" },
  "notifs":   { "pushEnabled": true, "emailEnabled": true, "smsEnabled": false },
  "security":  { "otpEnabled": false, "jwtExpiresIn": "7d", "maxLoginAttempts": 5 },
  "features": { "otpRequired": false, "paymentRequired": true }
}
```

---

## 6. Correction junction tables

Le bootstrap corrige automatiquement le mismatch entre les anciens noms de colonnes (snake_case) générés par l'ancien SQL et les noms attendus par TypeORM (camelCase).

| Table | Ancienne colonne | Nouvelle colonne |
|---|---|---|
| `order_dishes` | `orders_id` | `ordersId` |
| `order_dishes` | `dishes_id` | `dishesId` |
| `menu_dishes` | `menus_id` | `menusId` |
| `menu_dishes` | `dishes_id` | `dishesId` |

Si les colonnes sont déjà en camelCase (nouvelle installation), l'étape est ignorée silencieusement.

---

## 7. Procédure de mise en production

### Nouvelle installation (DB vide)

```bash
# 1. Définir le secret dans l'env
echo "BOOTSTRAP_SECRET=mon-secret-fort" >> .env.prod

# 2. Déployer l'application

# 3. Appeler l'endpoint bootstrap avec runMigrations: true
curl -X POST https://ton-api.com/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"secret": "mon-secret-fort", "runMigrations": true}'
```

### Base existante avec colonnes snake_case (patch uniquement)

```bash
# runMigrations: false si les tables existent déjà
curl -X POST https://ton-api.com/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"secret": "mon-secret-fort", "runMigrations": false}'
```

### Alternative pgAdmin

Si l'accès curl n'est pas possible, exécuter dans pgAdmin :

1. `docs/patch-junction-columns.sql` — corrige les colonnes junction
2. `docs/init-schema.sql` — crée le schéma et insère les données de départ

---

## 8. Alternatives CLI (hors API)

```bash
# Vérifier les migrations en attente
npm run build && npx typeorm migration:show -d dist/database/data-source.js

# Exécuter les migrations
npm run migration:run

# Synchroniser le schéma (hors prod uniquement)
npx typeorm schema:sync -d dist/database/data-source.js
```

> **Ne jamais mettre `synchronize: true` en production.** TypeORM peut supprimer des colonnes automatiquement.
