export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',      // MMS global admin (BO Web)
  ADMIN_MMS = 'ADMIN_MMS',          // MMS operational (Mobile terrain)
  ADMIN_CLIENT = 'ADMIN_CLIENT',    // Company admin (BO Client)
  EMPLOYEE = 'EMPLOYEE',             // Employee (Mobile)
  COOK = 'COOK',                     // Cuisinier (Mobile)
  PATIENT = 'PATIENT',               // Patient (Tablet)
}

export enum MenuMode {
  AUTONOME = 'AUTONOME',  // Admin client plans menus
  MMS = 'MMS',            // MMS plans menus
}

export enum SubventionType {
  FIXED = 'FIXED',           // Montant fixe FCFA
  PERCENTAGE = 'PERCENTAGE', // Pourcentage %
  CAPPED = 'CAPPED',         // Plafond mensuel
  HYBRID = 'HYBRID',         // Montant fixe + plafond
  FULL = 'FULL',             // 100% employeur
}

export enum MealSlot {
  MORNING = 'MORNING',
  NOON = 'NOON',
  EVENING = 'EVENING',
}

export enum DishCategory {
  ENTREE = 'ENTREE',
  RESISTANCE = 'RESISTANCE',
  DESSERT = 'DESSERT',
  CAFE = 'CAFE',
  BOISSON = 'BOISSON',
  COLLATION = 'COLLATION'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  READY = 'READY',
  RETRIEVED = 'RETRIEVED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  WAVE = 'WAVE',
  ORANGE_MONEY = 'ORANGE_MONEY',
  MTN = 'MTN',
  CINETPAY = 'CINETPAY',
  PAYDUNYA = 'PAYDUNYA',
  WALLET = 'WALLET',
  EMPLOYER = 'EMPLOYER', // 100% employeur, pas de paiement employé
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum NotificationChannel {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum FinancialMode {
  DEBT = 'DEBT',     // Commandes enregistrées comme dette
  WALLET = 'WALLET', // Commandes déduites du solde
}

export enum DietaryRegime {
  SANS_SEL = 'SANS_SEL',
  SANS_GRAS = 'SANS_GRAS',
  SANS_SUCRE = 'SANS_SUCRE',
  SANS_HUILE = 'SANS_HUILE',
  VEGETARIEN = 'VEGETARIEN',
  HALAL = 'HALAL',
}

export enum Allergy {
  ARACHIDES = 'ARACHIDES',
  CRUSTACES = 'CRUSTACES',
  OEUFS = 'OEUFS',
  POISSONS = 'POISSONS',
  SOJA = 'SOJA',
  LAIT = 'LAIT',
  FRUITS_A_COQUE = 'FRUITS_A_COQUE',
  CELERI = 'CELERI',
  MOUTARDE = 'MOUTARDE',
  SESAME = 'SESAME',
  SULFITES = 'SULFITES',
  LUPIN = 'LUPIN',
  MOLLUSQUES = 'MOLLUSQUES',
  GLUTEN = 'GLUTEN',
  AUCUNE = 'AUCUNE',
}
