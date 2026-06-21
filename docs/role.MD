# Rôles & Permissions — MMS Cantine

## Description des rôles

### SUPER_ADMIN
Administrateur global de la plateforme MMS.
Accès total sans restriction. Gère les organisations clientes, les paramètres globaux et peut intervenir sur n'importe quelle donnée.

### ADMIN_MMS
Agent opérationnel MMS (terrain ou support).
Gère les menus, plats, utilisateurs et commandes sur toutes les organisations. Ne peut pas créer d'organisations ni de SUPER_ADMIN.

### ADMIN_CLIENT
Administrateur d'une entreprise cliente (Back Office Web).
Gère tout ce qui concerne sa propre organisation : paramètres, mode invité, plats, menus, équipe, commandes et wallets. Isolé à son organisation — ne voit pas les autres.

### EMPLOYEE
Employé d'une entreprise cliente (Application mobile).
Consulte les menus du jour, passe des commandes, suit ses commandes et gère son wallet.

### COOK
Cuisinier (Application mobile cuisine).
Consulte les commandes à préparer et met à jour leur statut (PREPARING → READY). N'a pas accès aux données financières.

### SERVER
Serveur / distributeur de repas (Tablette ou application mobile).
Distribue les repas en scannant les QR codes et met à jour le statut (READY → RETRIEVED). N'a pas accès aux données financières.

---

## Matrice des permissions

### Organisations

| Route | SUPER_ADMIN | ADMIN_MMS | ADMIN_CLIENT | EMPLOYEE | COOK | SERVER |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| GET /organisations (liste complète) | ✅ | ✅ | — | — | — | — |
| GET /organisations/my (sa propre org) | ✅ | ✅ | ✅ | — | — | — |
| GET /organisations/public/:slug | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /organisations/:id | ✅ | ✅ | ✅ (sa propre) | — | — | — |
| POST /organisations (créer) | ✅ | — | — | — | — | — |
| PATCH /organisations/:id | ✅ | ✅ | ✅ (sa propre) | — | — | — |
| PATCH /organisations/my/guest-mode | ✅ | ✅ | ✅ | — | — | — |
| DELETE /organisations/:id | ✅ | — | — | — | — | — |

**Règles :**
- ADMIN_CLIENT ne peut lire/modifier que son organisation (contrôle par organisation_id du JWT)
- Le mode guest configure les commandes sans connexion par scan QR : toggle, horaires, champs invité, décalage jour

---

### Utilisateurs

| Route | SUPER_ADMIN | ADMIN_MMS | ADMIN_CLIENT | EMPLOYEE | COOK | SERVER |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| GET /users (liste) | ✅ | ✅ | ✅ (sa propre org) | — | — | — |
| GET /users?role=SERVER | ✅ | ✅ | ✅ (sa propre org) | — | — | — |
| GET /users/:id | ✅ | ✅ | ✅ | — | — | — |
| POST /users (créer / inviter) | ✅ | ✅ | ✅ (rôles limités) | — | — | — |
| PATCH /users/:id | ✅ | ✅ | ✅ (sa propre org) | — | — | — |
| PATCH /users/:id/toggle-active | ✅ | ✅ | ✅ (sa propre org) | — | — | — |
| DELETE /users/:id (hard delete) | ✅ | — | — | — | — | — |

**Règles :**
- ADMIN_CLIENT ne peut créer que des rôles : EMPLOYEE, COOK, SERVER
- ADMIN_CLIENT ne peut créer des users que dans sa propre organisation (organisation_id forcé depuis le JWT)
- ADMIN_MMS ne peut pas créer de SUPER_ADMIN
- Préférer toggle-active (soft) à delete (hard) pour désactiver un membre

---

### Plats

| Route | SUPER_ADMIN | ADMIN_MMS | ADMIN_CLIENT | EMPLOYEE | COOK | SERVER |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| GET /dishes (catalogue) | ✅ | ✅ | ✅ (sa propre org) | ✅ | ✅ | ✅ |
| GET /dishes/:id | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /dishes (créer) | ✅ | ✅ | ✅ | — | — | — |
| PATCH /dishes/:id | ✅ | ✅ | ✅ | — | — | — |
| DELETE /dishes/:id (soft) | ✅ | ✅ | ✅ | — | — | — |

**Règles :**
- Les plats créés par ADMIN_CLIENT sont attachés à son organisation (organisation_id auto depuis JWT)
- Les plats créés par SUPER_ADMIN ou ADMIN_MMS sont globaux (organisation_id = null)
- Un ADMIN_CLIENT ne voit que les plats de sa propre organisation dans GET /dishes

---

### Menus

| Route | SUPER_ADMIN | ADMIN_MMS | ADMIN_CLIENT | EMPLOYEE | COOK | SERVER |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| GET /menus/public/:orgId | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /menus/daily | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /menus | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /menus/:id | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /menus (créer) | ✅ | ✅ | ✅ | — | — | — |
| PUT /menus/:id (modifier) | ✅ | ✅ | ✅ | — | — | — |
| PATCH /menus/:id/publish | ✅ | ✅ | ✅ | — | — | — |
| DELETE /menus/:id | ✅ | ✅ | ✅ | — | — | — |

---

### Commandes

| Route | SUPER_ADMIN | ADMIN_MMS | ADMIN_CLIENT | EMPLOYEE | COOK | SERVER |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| GET /orders/my-orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /orders (toutes / par org) | ✅ | ✅ | ✅ (sa propre org) | — | — | — |
| GET /orders/stats/:orgId | ✅ | ✅ | ✅ (sa propre org) | — | — | — |
| GET /orders/:id | ✅ | ✅ | ✅ | — | — | — |
| POST /orders (créer commande) | ✅ | — | — | ✅ | — | — |
| POST /orders/guest (sans connexion) | public | public | public | public | public | public |
| PATCH /orders/:id/status | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| POST /orders/:id/status (fallback) | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| POST /orders/retrieve (scan QR) | ✅ | ✅ | ✅ | — | — | ✅ |
| PATCH /orders/:id/cancel | ✅ | ✅ | ✅ | ✅ | — | — |

**Transitions de statut par rôle :**
- COOK : CONFIRMED → PREPARING → READY
- SERVER : READY → RETRIEVED (via scan QR ou mise à jour manuelle)
- ADMIN_CLIENT / ADMIN_MMS / SUPER_ADMIN : toutes les transitions

---

### Wallet

| Route | SUPER_ADMIN | ADMIN_MMS | ADMIN_CLIENT | EMPLOYEE | COOK | SERVER |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| GET /wallet (mon solde) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /wallet/transactions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /wallet/credit (soi-même) | ✅ | ✅ | ✅ | ✅ | — | — |
| POST /wallet/credit?target_user_id (autre user) | ✅ | ✅ | ✅ | — | — | — |
| POST /wallet/debit | ✅ | ✅ | ✅ | — | — | — |

---

### Paiements

| Route | SUPER_ADMIN | ADMIN_MMS | ADMIN_CLIENT | EMPLOYEE | COOK | SERVER |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| GET /payments | ✅ | ✅ | ✅ | ✅ | — | — |
| GET /payments/:id | ✅ | ✅ | ✅ | ✅ | — | — |
| POST /payments (initier) | ✅ | — | ✅ | ✅ | — | — |
| POST /payments/webhook | public | public | public | public | public | public |
| PATCH /payments/:id/refund | ✅ | — | — | — | — | — |

---

## Récapitulatif par rôle

### SUPER_ADMIN
- Accès complet à toutes les ressources et toutes les organisations
- Seul à pouvoir créer / supprimer des organisations
- Seul à pouvoir rembourser un paiement
- Seul à pouvoir supprimer un utilisateur définitivement

### ADMIN_MMS
- Gère les menus et plats sur toutes les organisations
- Gère les utilisateurs (sauf SUPER_ADMIN)
- Voit toutes les commandes et peut modifier leur statut
- Peut créditer / débiter des wallets
- Ne peut pas créer ni supprimer d'organisations

### ADMIN_CLIENT
- Gère tout ce qui concerne **sa propre organisation uniquement**
- Paramètres org : branding, subventions, mode guest (horaires, champs, décalage)
- Équipe : créer EMPLOYEE / COOK / SERVER, les activer/désactiver, les modifier
- Plats : créer, modifier, désactiver (isolés à son org)
- Menus : créer, modifier, publier, supprimer
- Commandes : voir, modifier le statut, scanner QR, annuler
- Wallet : créditer / débiter les wallets de son équipe
- Ne peut pas accéder aux données d'autres organisations

### EMPLOYEE
- Consulte les menus du jour de son organisation
- Passe des commandes et les annule (statut PENDING/CONFIRMED uniquement)
- Suit ses propres commandes et son QR code de retrait
- Consulte son solde wallet et son historique de transactions
- Recharge son propre wallet

### COOK
- Consulte les commandes de son organisation
- Met à jour le statut : CONFIRMED → PREPARING → READY
- Consulte les menus et plats
- Pas d'accès aux données financières ni aux paramètres

### SERVER
- Scanne les QR codes pour marquer les commandes comme RETRIEVED
- Met à jour le statut : READY → RETRIEVED
- Consulte les commandes de son organisation
- Pas d'accès aux données financières ni aux paramètres
