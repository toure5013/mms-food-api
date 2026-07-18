import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

function dateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

import { User } from '../users/user.entity';
import { Organisation } from '../organisations/organisation.entity';
import { Dish } from '../dishes/dish.entity';
import { Menu } from '../menus/menu.entity';
import { Settings } from '../settings/settings.entity';
import { UserRole, MealSlot } from '../common/enums';

@Injectable()
export class BootstrapService {
  constructor(
    @InjectRepository(User)       private userRepo: Repository<User>,
    @InjectRepository(Organisation) private orgRepo: Repository<Organisation>,
    @InjectRepository(Dish)       private dishRepo: Repository<Dish>,
    @InjectRepository(Menu)       private menuRepo: Repository<Menu>,
    @InjectRepository(Settings)   private settingsRepo: Repository<Settings>,
    @InjectDataSource()           private dataSource: DataSource,
  ) {}

  async run(runMigrations: boolean) {
    const log: string[] = [];

    // ── 1. Migrations ──────────────────────────────────────────────────────────
    if (runMigrations) {
      const migrations = await this.dataSource.runMigrations({ transaction: 'all' });
      log.push(`migrations: ${migrations.length} exécutée(s) — ${migrations.map(m => m.name).join(', ') || 'aucune'}`);
    } else {
      log.push('migrations: ignorées (runMigrations=false)');
    }

    // ── 2. Patch colonnes junction (idempotent) ────────────────────────────────
    const patched = await this.patchJunctionColumns();
    log.push(`patch junction: ${patched}`);

    // ── 3. Settings ───────────────────────────────────────────────────────────
    const settingsCount = await this.settingsRepo.count();
    if (settingsCount === 0) {
      await this.settingsRepo.save(this.settingsRepo.create({
        general:  { appName: 'MMS Cantine', timezone: 'Africa/Abidjan', language: 'fr', currency: 'FCFA' },
        branding:  { primaryColor: '#E87722', secondaryColor: '#1A1A2E', logoUrl: null, favicon: null },
        notifs:   { pushEnabled: true, emailEnabled: true, smsEnabled: false, orderConfirmation: true, orderReady: true, dailyMenu: true },
        security:  { otpEnabled: false, jwtExpiresIn: '7d', maxLoginAttempts: 5 },
        org:      { defaultSubvention: 0, defaultSubventionType: 'FIXED', defaultFinancialMode: 'DEBT' },
        dietary:  { customAllergies: [], customRegimes: [] },
        features: { otpRequired: false, paymentRequired: true },
      }));
      log.push('settings: créé');
    } else {
      log.push('settings: déjà existant, ignoré');
    }

    // ── 4. Organisations ──────────────────────────────────────────────────────
    const orgs = await this.seedOrganisations();
    log.push(`organisations: ${orgs.created} créée(s), ${orgs.skipped} ignorée(s)`);

    // ── 5. Users ──────────────────────────────────────────────────────────────
    const users = await this.seedUsers();
    log.push(`utilisateurs: ${users.created} créé(s), ${users.skipped} ignoré(s)`);

    // ── 6. Dishes ─────────────────────────────────────────────────────────────
    const dishes = await this.seedDishes();
    log.push(`plats: ${dishes.created} créé(s), ${dishes.skipped} ignoré(s)`);

    // ── 7. Menus (7 jours glissants) ──────────────────────────────────────────
    const menus = await this.seedMenus();
    log.push(`menus: ${menus.created} créé(s), ${menus.skipped} ignoré(s)`);

    return { success: true, steps: log };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private async patchJunctionColumns(): Promise<string> {
    const colExists = async (table: string, col: string) => {
      const [{ exists }] = await this.dataSource.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2) AS exists`,
        [table, col],
      );
      return exists;
    };

    const msgs: string[] = [];
    await this.dataSource.transaction(async m => {
      if (await colExists('order_dishes', 'orders_id')) {
        await m.query(`DROP INDEX IF EXISTS "IDX_order_dishes_orders_id"`);
        await m.query(`DROP INDEX IF EXISTS "IDX_order_dishes_dishes_id"`);
        await m.query(`ALTER TABLE order_dishes RENAME COLUMN orders_id TO "ordersId"`);
        await m.query(`ALTER TABLE order_dishes RENAME COLUMN dishes_id TO "dishesId"`);
        await m.query(`CREATE INDEX IF NOT EXISTS "IDX_order_dishes_ordersId" ON order_dishes ("ordersId")`);
        await m.query(`CREATE INDEX IF NOT EXISTS "IDX_order_dishes_dishesId" ON order_dishes ("dishesId")`);
        msgs.push('order_dishes ✓');
      }
      if (await colExists('menu_dishes', 'menus_id')) {
        await m.query(`DROP INDEX IF EXISTS "IDX_menu_dishes_menus_id"`);
        await m.query(`DROP INDEX IF EXISTS "IDX_menu_dishes_dishes_id"`);
        await m.query(`ALTER TABLE menu_dishes RENAME COLUMN menus_id TO "menusId"`);
        await m.query(`ALTER TABLE menu_dishes RENAME COLUMN dishes_id TO "dishesId"`);
        await m.query(`CREATE INDEX IF NOT EXISTS "IDX_menu_dishes_menusId" ON menu_dishes ("menusId")`);
        await m.query(`CREATE INDEX IF NOT EXISTS "IDX_menu_dishes_dishesId" ON menu_dishes ("dishesId")`);
        msgs.push('menu_dishes ✓');
      }
    });
    return msgs.length ? msgs.join(', ') : 'déjà en camelCase';
  }

  private async upsertOrg(data: Partial<Organisation>): Promise<boolean> {
    const exists = await this.orgRepo.findOne({ where: { id: data.id } });
    if (exists) return false;
    await this.orgRepo.save(this.orgRepo.create(data));
    return true;
  }

  private async upsertUser(data: Partial<User>): Promise<boolean> {
    const exists = await this.userRepo.findOne({ where: { email: data.email } });
    if (exists) return false;
    await this.userRepo.save(this.userRepo.create(data));
    return true;
  }

  private async upsertDish(data: Partial<Dish>): Promise<boolean> {
    const exists = await this.dishRepo.findOne({ where: { id: data.id } });
    if (exists) return false;
    await this.dishRepo.save(this.dishRepo.create(data));
    return true;
  }

  // ── Seed data ────────────────────────────────────────────────────────────────

  private async seedOrganisations() {
    let created = 0, skipped = 0;

    const orgs: Partial<Organisation>[] = [
      {
        id: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',
        slug: 'togoom-corp', nom: 'TOGOOM CORP',
        couleur_primaire: '#FF6B00', couleur_secondaire: '#1A1A2E',
        subvention_type: 'FIXED' as any, subvention_valeur: 10000,
        financial_mode: 'DEBT' as any,
        is_guest_order_enabled: true,
        guest_config: { fields: [{ id: '1', type: 'text', label: 'Nom', required: true }, { id: '2', type: 'text', label: 'Téléphone', required: true }, { id: '3', type: 'text', label: 'Chambre', required: true }] },
        guest_order_start_time: '08:00', guest_order_end_time: '20:00',
        prix_max_plats: 10000, prix_max_menu: 10000,
      },
      {
        id: 'b0f44923-3897-4f11-923f-4e5659b897e2',
        slug: 'nsia-banque', nom: 'NSIA Banque',
        couleur_primaire: '#004A99', couleur_secondaire: '#D4AF37',
        subvention_type: 'FIXED' as any, subvention_valeur: 1500,
        financial_mode: 'DEBT' as any,
        is_guest_order_enabled: true,
        guest_config: { fields: [{ id: '1', type: 'text', label: 'Nom', required: true }, { id: '2', type: 'text', label: 'Prénom', required: true }, { id: '3', type: 'text', label: 'Numéro de téléphone', required: true }, { id: '4', type: 'text', label: 'Numéro de chambre', required: true }] },
        guest_order_start_time: '00:00', guest_order_end_time: '23:59',
        prix_max_plats: 0, prix_max_menu: 0,
      },
      {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        slug: 'demo-sarl', nom: 'Entreprise Demo SARL',
        couleur_primaire: '#E87722', couleur_secondaire: '#1A1A2E',
        subvention_type: 'FIXED' as any, subvention_valeur: 10000,
        financial_mode: 'DEBT' as any,
        is_guest_order_enabled: true,
        guest_config: { fields: [{ id: '1', type: 'text', label: 'Nom', required: true }, { id: '2', type: 'text', label: 'Numéro de téléphone', required: true }, { id: '3', type: 'text', label: 'Numéro de chambre', required: true }] },
        guest_order_start_time: '00:00', guest_order_end_time: '23:59',
        prix_min_plats: 10, prix_max_plats: 10000, prix_max_menu: 10000,
      },
      {
        id: 'b0f44923-3897-4f11-923f-4e5659b897e1',
        slug: 'orange-ci', nom: 'Orange Côte d\'Ivoire',
        couleur_primaire: '#FF7900', couleur_secondaire: '#000000',
        subvention_type: 'PERCENTAGE' as any, subvention_valeur: 50,
        financial_mode: 'DEBT' as any,
      },
      {
        id: 'b0f44923-3897-4f11-923f-4e5659b897e4',
        slug: 'cie-sodeci', nom: 'CIE-SODECI',
        couleur_primaire: '#003366', couleur_secondaire: '#FFFFFF',
        subvention_type: 'FULL' as any, subvention_valeur: 10000,
        financial_mode: 'DEBT' as any,
        prix_max_plats: 10000, prix_max_menu: 10000,
      },
    ];

    for (const org of orgs) {
      const ok = await this.upsertOrg(org);
      ok ? created++ : skipped++;
    }
    return { created, skipped };
  }

  private async seedUsers() {
    // hash de "password" — même hash que dans le dump réel
    const PASS = '$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2';
    let created = 0, skipped = 0;

    const users: Partial<User>[] = [
      // ── MMS ──────────────────────────────────────────────────────────────────
      {
        id: '00000000-0000-0000-0000-000000000001',
        prenom: 'Super', nom: 'Admin', email: 'admin@super.ci',
        password_hash: PASS, role: UserRole.SUPER_ADMIN,
        is_active: true, is_first_login: false,
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        prenom: 'Moussa', nom: 'Serveur', email: 'moussa.serveur@tog.ci',
        password_hash: PASS, role: UserRole.ADMIN_MMS,
        is_active: true, is_first_login: false,
        organisation_id: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',
      },
      {
        id: '11111111-1111-1111-1111-111111111111',
        prenom: 'Jean', nom: 'Cuisinier', email: 'chef@mms.ci',
        password_hash: PASS, role: UserRole.COOK,
        is_active: true, is_first_login: false,
        organisation_id: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',
      },
      // ── NSIA ─────────────────────────────────────────────────────────────────
      {
        id: '8d9e5f6f-a7cb-463b-9721-a123cf1815a6',
        prenom: 'Awa', nom: 'Koné', email: 'awa@nsia.ci',
        password_hash: PASS, role: UserRole.ADMIN_CLIENT,
        is_active: true, is_first_login: false,
        organisation_id: 'b0f44923-3897-4f11-923f-4e5659b897e2',
      },
      // ── Entreprise Demo ───────────────────────────────────────────────────────
      {
        id: '22222222-2222-2222-2222-222222222222',
        prenom: 'Fatou', nom: 'Admin', email: 'admin@demo.ci',
        password_hash: PASS, role: UserRole.ADMIN_CLIENT,
        is_active: true, is_first_login: false,
        organisation_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        prenom: 'Koffi', nom: 'Salarié', email: 'koffi@demo.ci',
        password_hash: PASS, role: UserRole.EMPLOYEE,
        is_active: true, is_first_login: false, loyalty_points: 50,
        organisation_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      },
      // ── TOGOOM ────────────────────────────────────────────────────────────────
      {
        id: 'f965ff2d-526c-4a25-96a2-65d761f8c282',
        prenom: 'Tog', nom: 'TOGOOM', email: 'admin@tog.ci',
        password_hash: PASS, role: UserRole.ADMIN_CLIENT,
        telephone: '+225 0708000000',
        is_active: true, is_first_login: false,
        organisation_id: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',
      },
      // ── Orange CI ─────────────────────────────────────────────────────────────
      {
        id: '63264bfa-cfa8-4276-8e77-a806e73c0a31',
        prenom: 'Koffi', nom: 'Kouassi', email: 'koffi@orange.ci',
        password_hash: PASS, role: UserRole.EMPLOYEE,
        is_active: true, is_first_login: false,
        organisation_id: 'b0f44923-3897-4f11-923f-4e5659b897e1',
      },
    ];

    for (const u of users) {
      const ok = await this.upsertUser(u);
      ok ? created++ : skipped++;
    }
    return { created, skipped };
  }

  private async seedDishes() {
    let created = 0, skipped = 0;

    const dishes: Partial<Dish>[] = [
      // ── Plats héritage (sans organisation = partagés) ─────────────────────
      { id: 'dfc63043-c855-4cdf-8a2f-5cded613766d', nom: 'Attiéké Poisson Grillé',     description: 'Poisson carpe ou thon grillé avec attiéké frais et piment', prix: 2500, halal: true, is_active: true },
      { id: '319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78', nom: 'Foutou Banane Sauce Graine', description: 'Foutou banane pilonné avec sauce graine riche en viande de brousse', prix: 3500, halal: true, is_active: true },
      { id: '8224f627-d251-4878-9212-8bace8f01db6', nom: 'Garba Royal',                 description: 'Attiéké de qualité supérieure avec thon frit croustillant', prix: 1500, halal: true, is_active: true },
      { id: '226bc708-130a-490c-8232-d5f696f50e9c', nom: 'Poulet Braisé',               description: 'Demi-poulet braisé aux épices locales servi avec alloco', prix: 4500, halal: true, is_active: true },
      { id: '78f6afd2-3d2b-4396-aade-87777de434d3', nom: 'Salade de Crudités',          description: 'Mélange de tomates, carottes, oignons et concombres frais', prix: 1500, sans_sel: true, sans_gras: true, vegetarien: true, halal: true, is_active: true },
      { id: 'b6359355-ef13-469f-8fad-dc11d659a93a', nom: 'Brochettes de Filet de Bœuf', description: '3 brochettes de bœuf tendres servies avec frites', prix: 3000, halal: true, is_active: true },
      { id: '3259bd25-4a2d-46c5-bdbd-0b227503779e', nom: 'Bissap Rouge',                description: 'Jus d\'oseille de Guinée Bio', prix: 500, sans_sel: true, sans_gras: true, vegetarien: true, halal: true, is_active: true },
      { id: 'ec31694f-6ae8-4006-a5c9-64ba4e789fa2', nom: 'Gnonmi',                      description: 'Petits beignets de mil fermenté au gingembre', prix: 500, vegetarien: true, halal: true, is_active: true },
      // ── Catalogue commun (sans organisation) ─────────────────────────────────
      // Entrées
      { id: '62b8f515-b59e-47b9-a056-41cb0eaef77a', nom: 'Salade composée',    description: 'Salade fraîche avec légumes variés',      prix: 2500, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'ENTREE' as any, is_active: true },
      { id: '1f270045-2a76-4062-ad4f-a23c84a7afa1', nom: 'Avocat crevettes',   description: 'Avocat farci aux crevettes',               prix: 4000, sans_sucre: true, halal: true, allergenes: ['crustacés'], categorie: 'ENTREE' as any, is_active: true },
      { id: '7ba9ce70-096b-436b-8987-911498799ab4', nom: 'Salade de fruits',   description: 'Mix de fruits frais',                      prix: 2000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'ENTREE' as any, is_active: true },
      { id: '6a287851-857e-4ec8-816a-dd9be9fe3116', nom: 'Carottes râpées',    description: 'Carottes fraîches râpées',                 prix: 1500, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'ENTREE' as any, is_active: true },
      { id: '3cf7d792-57db-4d7a-8c6b-e103d655c21c', nom: 'Taboulé',            description: 'Semoule et légumes',                       prix: 2500, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, allergenes: ['gluten'], categorie: 'ENTREE' as any, is_active: true },
      { id: 'b8efdf1b-ea1e-4625-ac8f-811b96b319b3', nom: 'Salade de thon',     description: 'Salade avec thon',                         prix: 3000, sans_sucre: true, halal: true, allergenes: ['poisson'], categorie: 'ENTREE' as any, is_active: true },
      { id: 'a4493300-70f3-4872-a4c6-83bd6035a700', nom: 'Soupe de légumes',   description: 'Soupe chaude maison',                      prix: 2000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'ENTREE' as any, is_active: true },
      { id: 'd7280cf7-95f0-4ef8-a79e-d6da36eb7953', nom: 'Salade grecque',     description: 'Tomate, feta, olive',                      prix: 3000, sans_sucre: true, vegetarien: true, halal: true, allergenes: ['lactose'], categorie: 'ENTREE' as any, is_active: true },
      { id: '0b092c6e-e7b8-4daf-abe0-bfdcb11d0326', nom: 'Pastels',            description: 'Beignets farcis',                          prix: 2500, halal: true, allergenes: ['gluten'], categorie: 'ENTREE' as any, is_active: true },
      { id: '9fa42c00-b56c-4097-9a0c-10fcb646daaa', nom: 'Samoussas',          description: 'Triangles croustillants',                  prix: 2500, halal: true, allergenes: ['gluten'], categorie: 'ENTREE' as any, is_active: true },
      // Résistances
      { id: '0a1c6e47-78c3-44c4-9f5a-285b19ba829c', nom: 'Riz gras poulet',       description: 'Riz africain avec poulet',              prix: 4000, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: 'f160775f-add2-41b7-b608-87600c64886a', nom: 'Attiéké poisson',        description: 'Attiéké avec poisson braisé',          prix: 3500, halal: true, allergenes: ['poisson'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: '41a0f45d-11a4-4efc-acf5-d27817c46c3c', nom: 'Garba',                  description: 'Attiéké + thon + piment',              prix: 2000, halal: true, allergenes: ['poisson'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: '58fc37e2-d3bf-4926-886d-f0ad6305c3d3', nom: 'Poulet braisé',          description: 'Poulet grillé africain',               prix: 5000, sans_sucre: true, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: 'f9d240e8-9251-42e6-acb8-895ba0815fc6', nom: 'Alloco poulet',          description: 'Banane frite + poulet',                prix: 3500, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: '1f99f68c-e9e9-4ce6-8375-bc2653c009a2', nom: 'Riz sauce arachide',     description: 'Riz avec sauce graine',                prix: 3000, halal: true, allergenes: ['arachide'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: '7a086b4c-4486-4f1a-8245-fa22bbc4c183', nom: 'Spaghetti bolognaise',   description: 'Pâtes avec viande',                    prix: 3500, halal: true, allergenes: ['gluten'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: '98da3cb5-4f7f-4fdb-9dae-45a96a74c098', nom: 'Poisson braisé',         description: 'Poisson grillé',                       prix: 4000, sans_sucre: true, halal: true, allergenes: ['poisson'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: 'e6d48da4-e129-4eeb-8d41-4ec4548d71a1', nom: 'Riz blanc sauce feuille', description: 'Riz avec sauce africaine',            prix: 3000, vegetarien: true, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: '240f4f16-3543-4b34-8857-e7d44cd4d1a0', nom: 'Tchep poulet',            description: 'Riz sénégalais',                      prix: 4500, halal: true, allergenes: ['poisson'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: 'c9c2e41a-458a-4e95-8fdd-fa51b0551c45', nom: 'Riz cantonais',           description: 'Riz sauté asiatique',                 prix: 4000, halal: true, allergenes: ['oeuf'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: '7e00741f-427d-4224-844f-c7a5b8c328dd', nom: 'Burger',                  description: 'Burger viande',                        prix: 4500, halal: true, allergenes: ['gluten'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: '1dfe37b8-3297-48bf-ae30-77c289d68ab1', nom: 'Pizza margherita',        description: 'Pizza tomate fromage',                 prix: 5000, vegetarien: true, halal: true, allergenes: ['gluten', 'lactose'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: 'c50f9eb1-5d2c-4d3a-8b5f-4416c5a1a1a3', nom: 'Poulet curry',            description: 'Poulet sauce curry',                  prix: 4000, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: '992de5be-1144-48ca-b236-1708b46adfad', nom: 'Riz sauté légumes',       description: 'Riz végétarien',                       prix: 3000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: '44cc8891-ef34-41e0-a2e5-620ca53594cf', nom: 'Grillades mixtes',        description: 'Viandes grillées',                     prix: 6000, sans_sucre: true, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: '909fd31b-dbce-4556-bf6f-4142109e02e4', nom: 'Yassa poulet',            description: 'Poulet oignon citron',                 prix: 4000, halal: true, categorie: 'RESISTANCE' as any, is_active: true },
      { id: '53ac078f-dac9-4a93-99cc-1dcc751a98d2', nom: 'Foutou sauce graine',     description: 'Plat ivoirien',                        prix: 3500, halal: true, allergenes: ['arachide'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: '6e38025e-ac56-4a6a-adb0-5a70ad140630', nom: 'Placali sauce claire',    description: 'Placali + sauce poisson',              prix: 3000, halal: true, allergenes: ['poisson'], categorie: 'RESISTANCE' as any, is_active: true },
      { id: 'd00d9da3-f68a-4d92-b8ce-c0386755293b', nom: 'Omelette légumes',        description: 'Omelette maison',                      prix: 2500, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, allergenes: ['oeuf'], categorie: 'RESISTANCE' as any, is_active: true },
      // Desserts
      { id: 'd3a98f34-78c9-427e-8150-48664495e151', nom: 'Tiramisu',          description: 'Dessert italien',    prix: 3000, halal: true, allergenes: ['lactose'], categorie: 'DESSERT' as any, is_active: true },
      { id: 'c88e6123-9c63-4f2b-b7ed-41f31046e52a', nom: 'Salade de fruits',  description: 'Fruits frais',       prix: 2000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'DESSERT' as any, is_active: true },
      { id: '925fef5f-684f-42e7-9bd9-3d6b91c6102f', nom: 'Glace vanille',     description: 'Glace douce',        prix: 1500, vegetarien: true, halal: true, allergenes: ['lactose'], categorie: 'DESSERT' as any, is_active: true },
      { id: '0e147599-c83f-4c10-a0d2-4b8277aa1520', nom: 'Crêpes',            description: 'Crêpes sucrées',     prix: 2000, vegetarien: true, halal: true, allergenes: ['gluten'], categorie: 'DESSERT' as any, is_active: true },
      { id: '1740052c-c9e9-4730-a2b1-e550ca2d6f43', nom: 'Gâteau chocolat',   description: 'Dessert chocolat',   prix: 2500, vegetarien: true, halal: true, allergenes: ['gluten'], categorie: 'DESSERT' as any, is_active: true },
      { id: '6e4998dc-94ad-4e36-8e0e-e4e4a08e164c', nom: 'Yaourt nature',     description: 'Yaourt frais',       prix: 1000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, allergenes: ['lactose'], categorie: 'DESSERT' as any, is_active: true },
      { id: 'd547bc27-fb27-4b87-a839-ff236c10d1e7', nom: 'Flan',              description: 'Dessert léger',      prix: 1500, vegetarien: true, halal: true, allergenes: ['oeuf'], categorie: 'DESSERT' as any, is_active: true },
      { id: 'c89af083-9dbe-4df0-a84e-1c488ece329d', nom: 'Beignets sucrés',   description: 'Dessert africain',   prix: 1500, vegetarien: true, halal: true, allergenes: ['gluten'], categorie: 'DESSERT' as any, is_active: true },
      // Boissons
      { id: 'da006819-7974-4154-99c4-518cff7c8588', nom: 'Jus d\'orange',    description: 'Jus naturel',    prix: 1500, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'BOISSON' as any, is_active: true },
      { id: '797ece9e-1bb0-42d9-b8b7-623953119902', nom: 'Jus de bissap',    description: 'Boisson locale',  prix: 1000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'BOISSON' as any, is_active: true },
      { id: '4aefedd4-a855-4b77-83e3-1b237d98960f', nom: 'Jus de gingembre', description: 'Boisson épicée', prix: 1000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'BOISSON' as any, is_active: true },
      { id: 'dd901f63-58c9-4d47-ab0a-d66bd5a7813c', nom: 'Coca-Cola',         description: 'Soda',           prix: 1000, vegetarien: true, halal: true, categorie: 'BOISSON' as any, is_active: true },
      { id: 'eeb8cec7-c167-4e2d-b092-638ecdb637ce', nom: 'Eau minérale',      description: 'Eau',            prix: 500,  sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'BOISSON' as any, is_active: true },
      { id: '3d3df6ea-d93d-4d52-b932-bd33b2b93133', nom: 'Smoothie mangue',   description: 'Boisson fruitée', prix: 2000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'BOISSON' as any, is_active: true },
      { id: 'e9308d1a-7ece-4e08-b6eb-8b931590b028', nom: 'Cocktail fruits',   description: 'Mix jus',         prix: 2000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'BOISSON' as any, is_active: true },
      { id: 'a6ca22cc-171c-4e82-9da4-0f76973f3d50', nom: 'Lait frais',        description: 'Boisson lactée',  prix: 1000, sans_sel: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, allergenes: ['lactose'], categorie: 'BOISSON' as any, is_active: true },
      // Café
      { id: 'dba6a6b7-02f3-41fa-b3e0-3671042134f7', nom: 'Espresso',    description: 'Café serré',   prix: 1000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'CAFE' as any, is_active: true },
      { id: 'b6222b9f-93ce-492d-97c7-cd4165912804', nom: 'Café latte',   description: 'Café au lait', prix: 1500, sans_sel: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, allergenes: ['lactose'], categorie: 'CAFE' as any, is_active: true },
      { id: 'caeafe4f-fce0-4a4e-97e6-3ad857dcaa95', nom: 'Cappuccino',   description: 'Café mousseux', prix: 1500, sans_sel: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, allergenes: ['lactose'], categorie: 'CAFE' as any, is_active: true },
      { id: 'd8bc176b-79dd-4d15-938d-48474984d023', nom: 'Thé',          description: 'Boisson chaude', prix: 1000, sans_sel: true, sans_gras: true, sans_sucre: true, sans_huile: true, vegetarien: true, halal: true, categorie: 'CAFE' as any, is_active: true },
    ];

    for (const d of dishes) {
      const ok = await this.upsertDish(d);
      ok ? created++ : skipped++;
    }
    return { created, skipped };
  }

  private async seedMenus() {
    let created = 0, skipped = 0;
    // Rotation de menus sur 7 jours pour NSIA + TOGOOM
    const menuPlans: Array<{ orgId: string; creneau: MealSlot; dishIds: string[] }[]> = [
      // Jour 0
      [
        { orgId: 'b0f44923-3897-4f11-923f-4e5659b897e2', creneau: MealSlot.NOON, dishIds: ['62b8f515-b59e-47b9-a056-41cb0eaef77a', '0a1c6e47-78c3-44c4-9f5a-285b19ba829c', 'f160775f-add2-41b7-b608-87600c64886a', 'c88e6123-9c63-4f2b-b7ed-41f31046e52a', '797ece9e-1bb0-42d9-b8b7-623953119902', 'eeb8cec7-c167-4e2d-b092-638ecdb637ce'] },
        { orgId: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b', creneau: MealSlot.NOON, dishIds: ['6a287851-857e-4ec8-816a-dd9be9fe3116', '58fc37e2-d3bf-4926-886d-f0ad6305c3d3', 'f9d240e8-9251-42e6-acb8-895ba0815fc6', '925fef5f-684f-42e7-9bd9-3d6b91c6102f', 'da006819-7974-4154-99c4-518cff7c8588'] },
      ],
      // Jour 1
      [
        { orgId: 'b0f44923-3897-4f11-923f-4e5659b897e2', creneau: MealSlot.NOON, dishIds: ['a4493300-70f3-4872-a4c6-83bd6035a700', '58fc37e2-d3bf-4926-886d-f0ad6305c3d3', 'f9d240e8-9251-42e6-acb8-895ba0815fc6', '6e4998dc-94ad-4e36-8e0e-e4e4a08e164c', 'da006819-7974-4154-99c4-518cff7c8588', 'eeb8cec7-c167-4e2d-b092-638ecdb637ce'] },
        { orgId: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b', creneau: MealSlot.NOON, dishIds: ['b8efdf1b-ea1e-4625-ac8f-811b96b319b3', '240f4f16-3543-4b34-8857-e7d44cd4d1a0', '1f99f68c-e9e9-4ce6-8375-bc2653c009a2', 'd3a98f34-78c9-427e-8150-48664495e151', '4aefedd4-a855-4b77-83e3-1b237d98960f'] },
      ],
      // Jour 2
      [
        { orgId: 'b0f44923-3897-4f11-923f-4e5659b897e2', creneau: MealSlot.NOON, dishIds: ['d7280cf7-95f0-4ef8-a79e-d6da36eb7953', '909fd31b-dbce-4556-bf6f-4142109e02e4', '53ac078f-dac9-4a93-99cc-1dcc751a98d2', 'd547bc27-fb27-4b87-a839-ff236c10d1e7', '797ece9e-1bb0-42d9-b8b7-623953119902', 'eeb8cec7-c167-4e2d-b092-638ecdb637ce'] },
        { orgId: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b', creneau: MealSlot.NOON, dishIds: ['0b092c6e-e7b8-4daf-abe0-bfdcb11d0326', 'c50f9eb1-5d2c-4d3a-8b5f-4416c5a1a1a3', '41a0f45d-11a4-4efc-acf5-d27817c46c3c', '0e147599-c83f-4c10-a0d2-4b8277aa1520', 'da006819-7974-4154-99c4-518cff7c8588'] },
      ],
      // Jour 3
      [
        { orgId: 'b0f44923-3897-4f11-923f-4e5659b897e2', creneau: MealSlot.NOON, dishIds: ['62b8f515-b59e-47b9-a056-41cb0eaef77a', '240f4f16-3543-4b34-8857-e7d44cd4d1a0', 'e6d48da4-e129-4eeb-8d41-4ec4548d71a1', 'c88e6123-9c63-4f2b-b7ed-41f31046e52a', '3d3df6ea-d93d-4d52-b932-bd33b2b93133', 'eeb8cec7-c167-4e2d-b092-638ecdb637ce'] },
        { orgId: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b', creneau: MealSlot.NOON, dishIds: ['9fa42c00-b56c-4097-9a0c-10fcb646daaa', '7e00741f-427d-4224-844f-c7a5b8c328dd', '98da3cb5-4f7f-4fdb-9dae-45a96a74c098', '1740052c-c9e9-4730-a2b1-e550ca2d6f43', '4aefedd4-a855-4b77-83e3-1b237d98960f'] },
      ],
      // Jour 4
      [
        { orgId: 'b0f44923-3897-4f11-923f-4e5659b897e2', creneau: MealSlot.NOON, dishIds: ['7ba9ce70-096b-436b-8987-911498799ab4', '0a1c6e47-78c3-44c4-9f5a-285b19ba829c', '58fc37e2-d3bf-4926-886d-f0ad6305c3d3', '6e4998dc-94ad-4e36-8e0e-e4e4a08e164c', 'da006819-7974-4154-99c4-518cff7c8588', 'eeb8cec7-c167-4e2d-b092-638ecdb637ce'] },
        { orgId: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b', creneau: MealSlot.NOON, dishIds: ['3cf7d792-57db-4d7a-8c6b-e103d655c21c', 'c9c2e41a-458a-4e95-8fdd-fa51b0551c45', '6e38025e-ac56-4a6a-adb0-5a70ad140630', 'c89af083-9dbe-4df0-a84e-1c488ece329d', '797ece9e-1bb0-42d9-b8b7-623953119902'] },
      ],
      // Jour 5
      [
        { orgId: 'b0f44923-3897-4f11-923f-4e5659b897e2', creneau: MealSlot.NOON, dishIds: ['b8efdf1b-ea1e-4625-ac8f-811b96b319b3', 'f9d240e8-9251-42e6-acb8-895ba0815fc6', '1f99f68c-e9e9-4ce6-8375-bc2653c009a2', 'd3a98f34-78c9-427e-8150-48664495e151', '4aefedd4-a855-4b77-83e3-1b237d98960f', 'eeb8cec7-c167-4e2d-b092-638ecdb637ce'] },
        { orgId: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b', creneau: MealSlot.NOON, dishIds: ['1f270045-2a76-4062-ad4f-a23c84a7afa1', '44cc8891-ef34-41e0-a2e5-620ca53594cf', 'd00d9da3-f68a-4d92-b8ce-c0386755293b', '925fef5f-684f-42e7-9bd9-3d6b91c6102f', 'da006819-7974-4154-99c4-518cff7c8588'] },
      ],
      // Jour 6
      [
        { orgId: 'b0f44923-3897-4f11-923f-4e5659b897e2', creneau: MealSlot.NOON, dishIds: ['a4493300-70f3-4872-a4c6-83bd6035a700', '909fd31b-dbce-4556-bf6f-4142109e02e4', '240f4f16-3543-4b34-8857-e7d44cd4d1a0', 'c89af083-9dbe-4df0-a84e-1c488ece329d', '3d3df6ea-d93d-4d52-b932-bd33b2b93133', 'eeb8cec7-c167-4e2d-b092-638ecdb637ce'] },
        { orgId: 'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b', creneau: MealSlot.NOON, dishIds: ['78f6afd2-3d2b-4396-aade-87777de434d3', '53ac078f-dac9-4a93-99cc-1dcc751a98d2', 'f160775f-add2-41b7-b608-87600c64886a', '6e4998dc-94ad-4e36-8e0e-e4e4a08e164c', '797ece9e-1bb0-42d9-b8b7-623953119902'] },
      ],
    ];

    for (let i = 0; i < menuPlans.length; i++) {
      const date = dateStr(i);
      for (const plan of menuPlans[i]) {
        const exists = await this.menuRepo.findOne({ where: { date, creneau: plan.creneau, organisation_id: plan.orgId } });
        if (exists) { skipped++; continue; }

        const dishes = await this.dishRepo.findByIds(plan.dishIds);
        const menu = this.menuRepo.create({ date, creneau: plan.creneau, organisation_id: plan.orgId, is_published: true, plats: dishes });
        await this.menuRepo.save(menu);
        created++;
      }
    }
    return { created, skipped };
  }
}
