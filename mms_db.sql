--
-- PostgreSQL database dump
--

-- Dumped from database version 15.18 (Debian 15.18-1.pgdg13+1)
-- Dumped by pg_dump version 15.18 (Debian 15.18-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: dishes_categorie_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.dishes_categorie_enum AS ENUM (
    'ENTREE',
    'RESISTANCE',
    'DESSERT',
    'CAFE',
    'BOISSON',
    'COLLATION'
);


ALTER TYPE public.dishes_categorie_enum OWNER TO postgres;

--
-- Name: loyalty_transactions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_transactions_type_enum AS ENUM (
    'EARNED',
    'REDEEMED',
    'EXPIRED',
    'BONUS'
);


ALTER TYPE public.loyalty_transactions_type_enum OWNER TO postgres;

--
-- Name: menus_creneau_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.menus_creneau_enum AS ENUM (
    'MORNING',
    'NOON',
    'EVENING',
    'SNACK'
);


ALTER TYPE public.menus_creneau_enum OWNER TO postgres;

--
-- Name: notifications_canal_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notifications_canal_enum AS ENUM (
    'PUSH',
    'EMAIL',
    'SMS'
);


ALTER TYPE public.notifications_canal_enum OWNER TO postgres;

--
-- Name: orders_creneau_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_creneau_enum AS ENUM (
    'MORNING',
    'NOON',
    'EVENING',
    'SNACK'
);


ALTER TYPE public.orders_creneau_enum OWNER TO postgres;

--
-- Name: orders_methode_paiement_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_methode_paiement_enum AS ENUM (
    'WAVE',
    'ORANGE_MONEY',
    'MTN',
    'CINETPAY',
    'PAYDUNYA',
    'WALLET',
    'EMPLOYER'
);


ALTER TYPE public.orders_methode_paiement_enum OWNER TO postgres;

--
-- Name: orders_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_statut_enum AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PAID',
    'PREPARING',
    'READY',
    'RETRIEVED',
    'CANCELLED'
);


ALTER TYPE public.orders_statut_enum OWNER TO postgres;

--
-- Name: organisations_financial_mode_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organisations_financial_mode_enum AS ENUM (
    'DEBT',
    'WALLET'
);


ALTER TYPE public.organisations_financial_mode_enum OWNER TO postgres;

--
-- Name: organisations_mode_gestion_menu_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organisations_mode_gestion_menu_enum AS ENUM (
    'AUTONOME',
    'MMS'
);


ALTER TYPE public.organisations_mode_gestion_menu_enum OWNER TO postgres;

--
-- Name: organisations_subvention_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.organisations_subvention_type_enum AS ENUM (
    'FIXED',
    'PERCENTAGE',
    'CAPPED',
    'HYBRID',
    'FULL'
);


ALTER TYPE public.organisations_subvention_type_enum OWNER TO postgres;

--
-- Name: payments_methode_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_methode_enum AS ENUM (
    'WAVE',
    'ORANGE_MONEY',
    'MTN',
    'CINETPAY',
    'PAYDUNYA',
    'WALLET',
    'EMPLOYER'
);


ALTER TYPE public.payments_methode_enum OWNER TO postgres;

--
-- Name: payments_statut_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_statut_enum AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payments_statut_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'SUPER_ADMIN',
    'ADMIN_MMS',
    'ADMIN_CLIENT',
    'EMPLOYEE',
    'COOK',
    'PATIENT'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

--
-- Name: wallet_transactions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.wallet_transactions_type_enum AS ENUM (
    'CREDIT',
    'DEBIT'
);


ALTER TYPE public.wallet_transactions_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dishes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dishes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying NOT NULL,
    description character varying,
    photo_url character varying,
    prix numeric(10,2) NOT NULL,
    sans_sel boolean DEFAULT false NOT NULL,
    sans_gras boolean DEFAULT false NOT NULL,
    sans_sucre boolean DEFAULT false NOT NULL,
    vegetarien boolean DEFAULT false NOT NULL,
    halal boolean DEFAULT false NOT NULL,
    allergenes text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    categorie public.dishes_categorie_enum,
    sans_huile boolean DEFAULT false NOT NULL
);


ALTER TABLE public.dishes OWNER TO postgres;

--
-- Name: loyalty_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.loyalty_transactions_type_enum NOT NULL,
    points integer NOT NULL,
    description character varying,
    reference character varying,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.loyalty_transactions OWNER TO postgres;

--
-- Name: menu_dishes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_dishes (
    "menusId" uuid NOT NULL,
    "dishesId" uuid NOT NULL
);


ALTER TABLE public.menu_dishes OWNER TO postgres;

--
-- Name: menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menus (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date date NOT NULL,
    creneau public.menus_creneau_enum NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    published_at timestamp without time zone,
    publication_limite timestamp without time zone,
    organisation_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    photo_url character varying
);


ALTER TABLE public.menus OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    titre character varying NOT NULL,
    message text NOT NULL,
    canal public.notifications_canal_enum DEFAULT 'PUSH'::public.notifications_canal_enum NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp without time zone,
    action_url character varying,
    metadata character varying,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: order_dishes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_dishes (
    "ordersId" uuid NOT NULL,
    "dishesId" uuid NOT NULL
);


ALTER TABLE public.order_dishes OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    numero_commande character varying NOT NULL,
    qr_code_token character varying NOT NULL,
    statut public.orders_statut_enum DEFAULT 'PENDING'::public.orders_statut_enum NOT NULL,
    creneau public.orders_creneau_enum NOT NULL,
    date_livraison date NOT NULL,
    montant_total numeric(10,2) NOT NULL,
    montant_subvention numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    montant_employe numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    methode_paiement public.orders_methode_paiement_enum,
    points_gagnes integer DEFAULT 0 NOT NULL,
    date_recuperation timestamp without time zone,
    recupere_par character varying,
    employe_id uuid,
    organisation_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    is_guest boolean DEFAULT false NOT NULL,
    guest_info jsonb
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: organisations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    slug character varying NOT NULL,
    nom character varying NOT NULL,
    logo_url character varying,
    couleur_primaire character varying DEFAULT '#E87722'::character varying NOT NULL,
    couleur_secondaire character varying DEFAULT '#1A1A2E'::character varying NOT NULL,
    mode_gestion_menu public.organisations_mode_gestion_menu_enum DEFAULT 'MMS'::public.organisations_mode_gestion_menu_enum NOT NULL,
    subvention_type public.organisations_subvention_type_enum DEFAULT 'FIXED'::public.organisations_subvention_type_enum NOT NULL,
    subvention_valeur numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    subvention_plafond_mensuel numeric(10,2),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    prix_min_plats numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    prix_max_plats numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    prix_max_menu numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    financial_mode public.organisations_financial_mode_enum DEFAULT 'DEBT'::public.organisations_financial_mode_enum NOT NULL,
    is_guest_order_enabled boolean DEFAULT false NOT NULL,
    guest_config jsonb,
    guest_order_start_time character varying,
    guest_order_end_time character varying,
    order_day_offset integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.organisations OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    reference character varying NOT NULL,
    methode public.payments_methode_enum NOT NULL,
    statut public.payments_statut_enum DEFAULT 'PENDING'::public.payments_statut_enum NOT NULL,
    montant numeric(10,2) NOT NULL,
    telephone character varying,
    provider_transaction_id character varying,
    provider_response character varying,
    error_message character varying,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    general jsonb,
    branding jsonb,
    notifs jsonb,
    security jsonb,
    org jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    dietary jsonb
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.settings_id_seq OWNER TO postgres;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    prenom character varying NOT NULL,
    nom character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying,
    role public.users_role_enum NOT NULL,
    telephone character varying,
    avatar_url character varying,
    service character varying,
    otp_code character varying,
    otp_expires_at timestamp without time zone,
    loyalty_points integer DEFAULT 0 NOT NULL,
    loyalty_expires_at timestamp without time zone,
    fcm_token character varying,
    is_active boolean DEFAULT true NOT NULL,
    is_first_login boolean DEFAULT false NOT NULL,
    organisation_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    regimes text,
    allergies text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: wallet_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wallet_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.wallet_transactions_type_enum NOT NULL,
    montant numeric(10,2) NOT NULL,
    solde_apres numeric(10,2) NOT NULL,
    description character varying,
    reference character varying,
    wallet_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.wallet_transactions OWNER TO postgres;

--
-- Name: wallets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wallets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    solde numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.wallets OWNER TO postgres;

--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Data for Name: dishes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dishes (id, nom, description, photo_url, prix, sans_sel, sans_gras, sans_sucre, vegetarien, halal, allergenes, is_active, created_at, updated_at, categorie, sans_huile) FROM stdin;
dfc63043-c855-4cdf-8a2f-5cded613766d	Attiéké Poisson Grillé	Poisson carpe ou thon grillé avec attiéké frais et piment	\N	2500.00	f	f	f	f	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78	Foutou Banane Sauce Graine	Foutou banane pilonné avec sauce graine riche en viande de brousse	\N	3500.00	f	f	f	f	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
8224f627-d251-4878-9212-8bace8f01db6	Garba Royal	Attiéké de qualité supérieure avec thon frit croustillant	\N	1500.00	f	f	f	f	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
226bc708-130a-490c-8232-d5f696f50e9c	Poulet Braisé	Demi-poulet braisé aux épices locales servi avec alloco	\N	4500.00	f	f	f	f	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
78f6afd2-3d2b-4396-aade-87777de434d3	Salade de Crudités	Mélange de tomates, carottes, oignons et concombres frais	\N	1500.00	t	t	f	t	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
b6359355-ef13-469f-8fad-dc11d659a93a	Brochettes de Filet de Bœuf	3 brochettes de bœuf tendres servies avec frites	\N	3000.00	f	f	f	f	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
3259bd25-4a2d-46c5-bdbd-0b227503779e	Bissap Rouge	Jus d'oseille de Guinée Bio	\N	500.00	t	t	f	t	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
ec31694f-6ae8-4006-a5c9-64ba4e789fa2	Gnonmi	Petits beignets de mil fermenté au gingembre	\N	500.00	f	f	f	t	t	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	f
62b8f515-b59e-47b9-a056-41cb0eaef77a	Salade composée	Salade fraîche avec légumes variés		2500.00	f	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	t
1f270045-2a76-4062-ad4f-a23c84a7afa1	Avocat crevettes	Avocat farci aux crevettes		4000.00	f	f	t	f	t	crustacés	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	f
7ba9ce70-096b-436b-8987-911498799ab4	Salade de fruits	Mix de fruits frais		2000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	t
6a287851-857e-4ec8-816a-dd9be9fe3116	Carottes râpées	Carottes fraîches râpées		1500.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	t
3cf7d792-57db-4d7a-8c6b-e103d655c21c	Taboulé	Semoule et légumes		2500.00	f	t	t	t	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	t
b8efdf1b-ea1e-4625-ac8f-811b96b319b3	Salade de thon	Salade avec thon		3000.00	f	f	t	f	t	poisson	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	f
a4493300-70f3-4872-a4c6-83bd6035a700	Soupe de légumes	Soupe chaude maison		2000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	t
d7280cf7-95f0-4ef8-a79e-d6da36eb7953	Salade grecque	Tomate, feta, olive		3000.00	f	f	t	t	t	lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	f
0b092c6e-e7b8-4daf-abe0-bfdcb11d0326	Pastels	Beignets farcis		2500.00	f	f	f	f	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	f
9fa42c00-b56c-4097-9a0c-10fcb646daaa	Samoussas	Triangles croustillants		2500.00	f	f	f	f	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	ENTREE	f
0a1c6e47-78c3-44c4-9f5a-285b19ba829c	Riz gras poulet	Riz africain avec poulet		4000.00	f	f	f	f	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
f160775f-add2-41b7-b608-87600c64886a	Attiéké poisson	Attiéké avec poisson braisé		3500.00	f	f	f	f	t	poisson	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
41a0f45d-11a4-4efc-acf5-d27817c46c3c	Garba	Attiéké + thon + piment		2000.00	f	f	f	f	t	poisson	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
58fc37e2-d3bf-4926-886d-f0ad6305c3d3	Poulet braisé	Poulet grillé africain		5000.00	f	f	t	f	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
f9d240e8-9251-42e6-acb8-895ba0815fc6	Alloco poulet	Banane frite + poulet		3500.00	f	f	f	f	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
1f99f68c-e9e9-4ce6-8375-bc2653c009a2	Riz sauce arachide	Riz avec sauce graine		3000.00	f	f	f	f	t	arachide	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
7a086b4c-4486-4f1a-8245-fa22bbc4c183	Spaghetti bolognaise	Pâtes avec viande		3500.00	f	f	f	f	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
98da3cb5-4f7f-4fdb-9dae-45a96a74c098	Poisson braisé	Poisson grillé		4000.00	f	f	t	f	t	poisson	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
e6d48da4-e129-4eeb-8d41-4ec4548d71a1	Riz blanc sauce feuille	Riz avec sauce africaine		3000.00	f	f	f	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
240f4f16-3543-4b34-8857-e7d44cd4d1a0	Tchep poulet	Riz sénégalais		4500.00	f	f	f	f	t	poisson	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
c9c2e41a-458a-4e95-8fdd-fa51b0551c45	Riz cantonais	Riz sauté asiatique		4000.00	f	f	f	f	t	oeuf	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
7e00741f-427d-4224-844f-c7a5b8c328dd	Burger	Burger viande		4500.00	f	f	f	f	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
1dfe37b8-3297-48bf-ae30-77c289d68ab1	Pizza margherita	Pizza tomate fromage		5000.00	f	f	f	t	t	gluten,lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
c50f9eb1-5d2c-4d3a-8b5f-4416c5a1a1a3	Poulet curry	Poulet sauce curry		4000.00	f	f	f	f	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
992de5be-1144-48ca-b236-1708b46adfad	Riz sauté légumes	Riz végétarien		3000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	t
44cc8891-ef34-41e0-a2e5-620ca53594cf	Grillades mixtes	Viandes grillées		6000.00	f	f	t	f	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
909fd31b-dbce-4556-bf6f-4142109e02e4	Yassa poulet	Poulet oignon citron		4000.00	f	f	f	f	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
53ac078f-dac9-4a93-99cc-1dcc751a98d2	Foutou sauce graine	Plat ivoirien		3500.00	f	f	f	f	t	arachide	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
6e38025e-ac56-4a6a-adb0-5a70ad140630	Placali sauce claire	Placali + sauce poisson		3000.00	f	f	f	f	t	poisson	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	f
d00d9da3-f68a-4d92-b8ce-c0386755293b	Omelette légumes	Omelette maison		2500.00	t	t	t	t	t	oeuf	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	RESISTANCE	t
d3a98f34-78c9-427e-8150-48664495e151	Tiramisu	Dessert italien		3000.00	f	f	f	f	t	lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	f
c88e6123-9c63-4f2b-b7ed-41f31046e52a	Salade de fruits	Fruits frais		2000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	t
925fef5f-684f-42e7-9bd9-3d6b91c6102f	Glace vanille	Glace douce		1500.00	f	f	f	t	t	lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	f
0e147599-c83f-4c10-a0d2-4b8277aa1520	Crêpes	Crêpes sucrées		2000.00	f	f	f	t	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	f
1740052c-c9e9-4730-a2b1-e550ca2d6f43	Gâteau chocolat	Dessert chocolat		2500.00	f	f	f	t	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	f
6e4998dc-94ad-4e36-8e0e-e4e4a08e164c	Yaourt nature	Yaourt frais		1000.00	t	t	t	t	t	lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	t
d547bc27-fb27-4b87-a839-ff236c10d1e7	Flan	Dessert léger		1500.00	f	f	f	t	t	oeuf	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	f
c89af083-9dbe-4df0-a84e-1c488ece329d	Beignets sucrés	Dessert africain		1500.00	f	f	f	t	t	gluten	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	DESSERT	f
da006819-7974-4154-99c4-518cff7c8588	Jus d'orange	Jus naturel		1500.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	t
797ece9e-1bb0-42d9-b8b7-623953119902	Jus de bissap	Boisson locale		1000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	t
4aefedd4-a855-4b77-83e3-1b237d98960f	Jus de gingembre	Boisson épicée		1000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	t
dd901f63-58c9-4d47-ab0a-d66bd5a7813c	Coca-Cola	Soda		1000.00	f	f	f	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	f
eeb8cec7-c167-4e2d-b092-638ecdb637ce	Eau minérale	Eau		500.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	t
3d3df6ea-d93d-4d52-b932-bd33b2b93133	Smoothie mangue	Boisson fruitée		2000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	t
e9308d1a-7ece-4e08-b6eb-8b931590b028	Cocktail fruits	Mix jus		2000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	t
a6ca22cc-171c-4e82-9da4-0f76973f3d50	Lait frais	Boisson lactée		1000.00	t	f	t	t	t	lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	BOISSON	t
dba6a6b7-02f3-41fa-b3e0-3671042134f7	Espresso	Café serré		1000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	CAFE	t
b6222b9f-93ce-492d-97c7-cd4165912804	Café latte	Café au lait		1500.00	t	f	t	t	t	lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	CAFE	t
caeafe4f-fce0-4a4e-97e6-3ad857dcaa95	Cappuccino	Café mousseux		1500.00	t	f	t	t	t	lactose	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	CAFE	t
d8bc176b-79dd-4d15-938d-48474984d023	Thé	Boisson chaude		1000.00	t	t	t	t	t	aucun	t	2026-04-22 09:25:04.119432	2026-04-22 09:25:04.119432	CAFE	t
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_transactions (id, type, points, description, reference, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: menu_dishes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_dishes ("menusId", "dishesId") FROM stdin;
ee7396f9-8e62-46d0-ad48-222a134f61b2	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
ee7396f9-8e62-46d0-ad48-222a134f61b2	8224f627-d251-4878-9212-8bace8f01db6
ee7396f9-8e62-46d0-ad48-222a134f61b2	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	dfc63043-c855-4cdf-8a2f-5cded613766d
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	8224f627-d251-4878-9212-8bace8f01db6
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	226bc708-130a-490c-8232-d5f696f50e9c
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	78f6afd2-3d2b-4396-aade-87777de434d3
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	b6359355-ef13-469f-8fad-dc11d659a93a
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	3259bd25-4a2d-46c5-bdbd-0b227503779e
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
3bae2a14-bc15-4c1a-813c-e80a7c22e981	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
3bae2a14-bc15-4c1a-813c-e80a7c22e981	8224f627-d251-4878-9212-8bace8f01db6
3bae2a14-bc15-4c1a-813c-e80a7c22e981	b6359355-ef13-469f-8fad-dc11d659a93a
6f041b47-c0e0-4fe3-bfed-e14a58afc3ec	8224f627-d251-4878-9212-8bace8f01db6
6f041b47-c0e0-4fe3-bfed-e14a58afc3ec	226bc708-130a-490c-8232-d5f696f50e9c
6f041b47-c0e0-4fe3-bfed-e14a58afc3ec	78f6afd2-3d2b-4396-aade-87777de434d3
6f041b47-c0e0-4fe3-bfed-e14a58afc3ec	b6359355-ef13-469f-8fad-dc11d659a93a
6f041b47-c0e0-4fe3-bfed-e14a58afc3ec	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
21115772-f24a-4da2-8038-bb0a1c63eb28	226bc708-130a-490c-8232-d5f696f50e9c
21115772-f24a-4da2-8038-bb0a1c63eb28	78f6afd2-3d2b-4396-aade-87777de434d3
21115772-f24a-4da2-8038-bb0a1c63eb28	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
cdb4a201-71ac-4d40-8ccd-fca139017bd5	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
cdb4a201-71ac-4d40-8ccd-fca139017bd5	8224f627-d251-4878-9212-8bace8f01db6
cdb4a201-71ac-4d40-8ccd-fca139017bd5	226bc708-130a-490c-8232-d5f696f50e9c
cdb4a201-71ac-4d40-8ccd-fca139017bd5	78f6afd2-3d2b-4396-aade-87777de434d3
cdb4a201-71ac-4d40-8ccd-fca139017bd5	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
8fb38991-d066-4d4f-a092-29fd946e1a0e	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
8fb38991-d066-4d4f-a092-29fd946e1a0e	8224f627-d251-4878-9212-8bace8f01db6
8fb38991-d066-4d4f-a092-29fd946e1a0e	226bc708-130a-490c-8232-d5f696f50e9c
8fb38991-d066-4d4f-a092-29fd946e1a0e	b6359355-ef13-469f-8fad-dc11d659a93a
8fb38991-d066-4d4f-a092-29fd946e1a0e	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
a7e57939-95ca-4ba3-83fe-90fca79de9fa	226bc708-130a-490c-8232-d5f696f50e9c
a7e57939-95ca-4ba3-83fe-90fca79de9fa	78f6afd2-3d2b-4396-aade-87777de434d3
a7e57939-95ca-4ba3-83fe-90fca79de9fa	b6359355-ef13-469f-8fad-dc11d659a93a
d34398db-33a3-4170-87b7-fad9564eecfe	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
d34398db-33a3-4170-87b7-fad9564eecfe	8224f627-d251-4878-9212-8bace8f01db6
d34398db-33a3-4170-87b7-fad9564eecfe	b6359355-ef13-469f-8fad-dc11d659a93a
d34398db-33a3-4170-87b7-fad9564eecfe	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
1a4584c6-0b22-4b5e-85f4-130093570825	dfc63043-c855-4cdf-8a2f-5cded613766d
1a4584c6-0b22-4b5e-85f4-130093570825	8224f627-d251-4878-9212-8bace8f01db6
1a4584c6-0b22-4b5e-85f4-130093570825	3259bd25-4a2d-46c5-bdbd-0b227503779e
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	8224f627-d251-4878-9212-8bace8f01db6
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	b6359355-ef13-469f-8fad-dc11d659a93a
98862972-4eb3-4c16-927a-ff4df177036e	8224f627-d251-4878-9212-8bace8f01db6
98862972-4eb3-4c16-927a-ff4df177036e	226bc708-130a-490c-8232-d5f696f50e9c
98862972-4eb3-4c16-927a-ff4df177036e	3259bd25-4a2d-46c5-bdbd-0b227503779e
9bc3f113-a5bd-4b3d-8457-90c335705ef5	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
8ce151db-219d-4af3-a2f7-5c030dd5a866	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
8ce151db-219d-4af3-a2f7-5c030dd5a866	8224f627-d251-4878-9212-8bace8f01db6
8ce151db-219d-4af3-a2f7-5c030dd5a866	b6359355-ef13-469f-8fad-dc11d659a93a
8ce151db-219d-4af3-a2f7-5c030dd5a866	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
533fb89c-d4af-416c-b029-7ff2f4a7e981	dfc63043-c855-4cdf-8a2f-5cded613766d
0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3	1f270045-2a76-4062-ad4f-a23c84a7afa1
0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3	7ba9ce70-096b-436b-8987-911498799ab4
0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3	9fa42c00-b56c-4097-9a0c-10fcb646daaa
ee7396f9-8e62-46d0-ad48-222a134f61b2	62b8f515-b59e-47b9-a056-41cb0eaef77a
ee7396f9-8e62-46d0-ad48-222a134f61b2	0b092c6e-e7b8-4daf-abe0-bfdcb11d0326
ee7396f9-8e62-46d0-ad48-222a134f61b2	9fa42c00-b56c-4097-9a0c-10fcb646daaa
ee7396f9-8e62-46d0-ad48-222a134f61b2	a6ca22cc-171c-4e82-9da4-0f76973f3d50
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	d7280cf7-95f0-4ef8-a79e-d6da36eb7953
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	9fa42c00-b56c-4097-9a0c-10fcb646daaa
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	7e00741f-427d-4224-844f-c7a5b8c328dd
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	53ac078f-dac9-4a93-99cc-1dcc751a98d2
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	da006819-7974-4154-99c4-518cff7c8588
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	4aefedd4-a855-4b77-83e3-1b237d98960f
3bae2a14-bc15-4c1a-813c-e80a7c22e981	b8efdf1b-ea1e-4625-ac8f-811b96b319b3
3bae2a14-bc15-4c1a-813c-e80a7c22e981	d7280cf7-95f0-4ef8-a79e-d6da36eb7953
3bae2a14-bc15-4c1a-813c-e80a7c22e981	41a0f45d-11a4-4efc-acf5-d27817c46c3c
3bae2a14-bc15-4c1a-813c-e80a7c22e981	53ac078f-dac9-4a93-99cc-1dcc751a98d2
d34398db-33a3-4170-87b7-fad9564eecfe	1f270045-2a76-4062-ad4f-a23c84a7afa1
d34398db-33a3-4170-87b7-fad9564eecfe	7ba9ce70-096b-436b-8987-911498799ab4
d34398db-33a3-4170-87b7-fad9564eecfe	6a287851-857e-4ec8-816a-dd9be9fe3116
d34398db-33a3-4170-87b7-fad9564eecfe	b8efdf1b-ea1e-4625-ac8f-811b96b319b3
d34398db-33a3-4170-87b7-fad9564eecfe	7e00741f-427d-4224-844f-c7a5b8c328dd
d34398db-33a3-4170-87b7-fad9564eecfe	1dfe37b8-3297-48bf-ae30-77c289d68ab1
d34398db-33a3-4170-87b7-fad9564eecfe	53ac078f-dac9-4a93-99cc-1dcc751a98d2
d34398db-33a3-4170-87b7-fad9564eecfe	6e38025e-ac56-4a6a-adb0-5a70ad140630
d34398db-33a3-4170-87b7-fad9564eecfe	d3a98f34-78c9-427e-8150-48664495e151
d34398db-33a3-4170-87b7-fad9564eecfe	1740052c-c9e9-4730-a2b1-e550ca2d6f43
d34398db-33a3-4170-87b7-fad9564eecfe	6e4998dc-94ad-4e36-8e0e-e4e4a08e164c
d34398db-33a3-4170-87b7-fad9564eecfe	d547bc27-fb27-4b87-a839-ff236c10d1e7
d34398db-33a3-4170-87b7-fad9564eecfe	da006819-7974-4154-99c4-518cff7c8588
d34398db-33a3-4170-87b7-fad9564eecfe	4aefedd4-a855-4b77-83e3-1b237d98960f
d34398db-33a3-4170-87b7-fad9564eecfe	b6222b9f-93ce-492d-97c7-cd4165912804
d34398db-33a3-4170-87b7-fad9564eecfe	caeafe4f-fce0-4a4e-97e6-3ad857dcaa95
1a4584c6-0b22-4b5e-85f4-130093570825	62b8f515-b59e-47b9-a056-41cb0eaef77a
1a4584c6-0b22-4b5e-85f4-130093570825	7ba9ce70-096b-436b-8987-911498799ab4
1a4584c6-0b22-4b5e-85f4-130093570825	d7280cf7-95f0-4ef8-a79e-d6da36eb7953
1a4584c6-0b22-4b5e-85f4-130093570825	1f99f68c-e9e9-4ce6-8375-bc2653c009a2
1a4584c6-0b22-4b5e-85f4-130093570825	e6d48da4-e129-4eeb-8d41-4ec4548d71a1
1a4584c6-0b22-4b5e-85f4-130093570825	7e00741f-427d-4224-844f-c7a5b8c328dd
1a4584c6-0b22-4b5e-85f4-130093570825	1dfe37b8-3297-48bf-ae30-77c289d68ab1
1a4584c6-0b22-4b5e-85f4-130093570825	992de5be-1144-48ca-b236-1708b46adfad
1a4584c6-0b22-4b5e-85f4-130093570825	53ac078f-dac9-4a93-99cc-1dcc751a98d2
1a4584c6-0b22-4b5e-85f4-130093570825	4aefedd4-a855-4b77-83e3-1b237d98960f
1a4584c6-0b22-4b5e-85f4-130093570825	3d3df6ea-d93d-4d52-b932-bd33b2b93133
1a4584c6-0b22-4b5e-85f4-130093570825	b6222b9f-93ce-492d-97c7-cd4165912804
1a4584c6-0b22-4b5e-85f4-130093570825	caeafe4f-fce0-4a4e-97e6-3ad857dcaa95
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	1f270045-2a76-4062-ad4f-a23c84a7afa1
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	d7280cf7-95f0-4ef8-a79e-d6da36eb7953
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	0b092c6e-e7b8-4daf-abe0-bfdcb11d0326
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	9fa42c00-b56c-4097-9a0c-10fcb646daaa
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	0a1c6e47-78c3-44c4-9f5a-285b19ba829c
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	41a0f45d-11a4-4efc-acf5-d27817c46c3c
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	f9d240e8-9251-42e6-acb8-895ba0815fc6
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	1f99f68c-e9e9-4ce6-8375-bc2653c009a2
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	240f4f16-3543-4b34-8857-e7d44cd4d1a0
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	1dfe37b8-3297-48bf-ae30-77c289d68ab1
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	909fd31b-dbce-4556-bf6f-4142109e02e4
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	53ac078f-dac9-4a93-99cc-1dcc751a98d2
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	c88e6123-9c63-4f2b-b7ed-41f31046e52a
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	1740052c-c9e9-4730-a2b1-e550ca2d6f43
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	d547bc27-fb27-4b87-a839-ff236c10d1e7
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	da006819-7974-4154-99c4-518cff7c8588
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	797ece9e-1bb0-42d9-b8b7-623953119902
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	4aefedd4-a855-4b77-83e3-1b237d98960f
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	eeb8cec7-c167-4e2d-b092-638ecdb637ce
9537b69f-33bd-4980-9163-67109ba591ab	b6359355-ef13-469f-8fad-dc11d659a93a
9537b69f-33bd-4980-9163-67109ba591ab	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
9537b69f-33bd-4980-9163-67109ba591ab	a6ca22cc-171c-4e82-9da4-0f76973f3d50
9537b69f-33bd-4980-9163-67109ba591ab	b6222b9f-93ce-492d-97c7-cd4165912804
9537b69f-33bd-4980-9163-67109ba591ab	caeafe4f-fce0-4a4e-97e6-3ad857dcaa95
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	226bc708-130a-490c-8232-d5f696f50e9c
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	b6359355-ef13-469f-8fad-dc11d659a93a
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	1f270045-2a76-4062-ad4f-a23c84a7afa1
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	d7280cf7-95f0-4ef8-a79e-d6da36eb7953
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	7e00741f-427d-4224-844f-c7a5b8c328dd
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	53ac078f-dac9-4a93-99cc-1dcc751a98d2
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	dba6a6b7-02f3-41fa-b3e0-3671042134f7
8915adca-a23c-4e33-aabb-c1aa77e461d3	dfc63043-c855-4cdf-8a2f-5cded613766d
8915adca-a23c-4e33-aabb-c1aa77e461d3	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
8915adca-a23c-4e33-aabb-c1aa77e461d3	8224f627-d251-4878-9212-8bace8f01db6
8915adca-a23c-4e33-aabb-c1aa77e461d3	b6359355-ef13-469f-8fad-dc11d659a93a
8915adca-a23c-4e33-aabb-c1aa77e461d3	3259bd25-4a2d-46c5-bdbd-0b227503779e
8915adca-a23c-4e33-aabb-c1aa77e461d3	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
8915adca-a23c-4e33-aabb-c1aa77e461d3	1f270045-2a76-4062-ad4f-a23c84a7afa1
8915adca-a23c-4e33-aabb-c1aa77e461d3	a4493300-70f3-4872-a4c6-83bd6035a700
8915adca-a23c-4e33-aabb-c1aa77e461d3	9fa42c00-b56c-4097-9a0c-10fcb646daaa
8915adca-a23c-4e33-aabb-c1aa77e461d3	d3a98f34-78c9-427e-8150-48664495e151
8915adca-a23c-4e33-aabb-c1aa77e461d3	6e4998dc-94ad-4e36-8e0e-e4e4a08e164c
8915adca-a23c-4e33-aabb-c1aa77e461d3	a6ca22cc-171c-4e82-9da4-0f76973f3d50
8915adca-a23c-4e33-aabb-c1aa77e461d3	b6222b9f-93ce-492d-97c7-cd4165912804
8915adca-a23c-4e33-aabb-c1aa77e461d3	caeafe4f-fce0-4a4e-97e6-3ad857dcaa95
49e80d54-467d-48d0-a767-95aebe17d137	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
49e80d54-467d-48d0-a767-95aebe17d137	8224f627-d251-4878-9212-8bace8f01db6
49e80d54-467d-48d0-a767-95aebe17d137	78f6afd2-3d2b-4396-aade-87777de434d3
49e80d54-467d-48d0-a767-95aebe17d137	b6359355-ef13-469f-8fad-dc11d659a93a
49e80d54-467d-48d0-a767-95aebe17d137	3d3df6ea-d93d-4d52-b932-bd33b2b93133
49e80d54-467d-48d0-a767-95aebe17d137	a6ca22cc-171c-4e82-9da4-0f76973f3d50
49e80d54-467d-48d0-a767-95aebe17d137	dba6a6b7-02f3-41fa-b3e0-3671042134f7
49e80d54-467d-48d0-a767-95aebe17d137	d8bc176b-79dd-4d15-938d-48474984d023
98751ac0-98bc-443f-be05-17f03c42101a	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
98751ac0-98bc-443f-be05-17f03c42101a	8224f627-d251-4878-9212-8bace8f01db6
98751ac0-98bc-443f-be05-17f03c42101a	b6359355-ef13-469f-8fad-dc11d659a93a
98751ac0-98bc-443f-be05-17f03c42101a	1f270045-2a76-4062-ad4f-a23c84a7afa1
98751ac0-98bc-443f-be05-17f03c42101a	7ba9ce70-096b-436b-8987-911498799ab4
98751ac0-98bc-443f-be05-17f03c42101a	6a287851-857e-4ec8-816a-dd9be9fe3116
98751ac0-98bc-443f-be05-17f03c42101a	0b092c6e-e7b8-4daf-abe0-bfdcb11d0326
98751ac0-98bc-443f-be05-17f03c42101a	41a0f45d-11a4-4efc-acf5-d27817c46c3c
98751ac0-98bc-443f-be05-17f03c42101a	7e00741f-427d-4224-844f-c7a5b8c328dd
98751ac0-98bc-443f-be05-17f03c42101a	44cc8891-ef34-41e0-a2e5-620ca53594cf
98751ac0-98bc-443f-be05-17f03c42101a	53ac078f-dac9-4a93-99cc-1dcc751a98d2
98751ac0-98bc-443f-be05-17f03c42101a	d3a98f34-78c9-427e-8150-48664495e151
98751ac0-98bc-443f-be05-17f03c42101a	1740052c-c9e9-4730-a2b1-e550ca2d6f43
98751ac0-98bc-443f-be05-17f03c42101a	6e4998dc-94ad-4e36-8e0e-e4e4a08e164c
98751ac0-98bc-443f-be05-17f03c42101a	d547bc27-fb27-4b87-a839-ff236c10d1e7
98751ac0-98bc-443f-be05-17f03c42101a	da006819-7974-4154-99c4-518cff7c8588
98751ac0-98bc-443f-be05-17f03c42101a	797ece9e-1bb0-42d9-b8b7-623953119902
98751ac0-98bc-443f-be05-17f03c42101a	eeb8cec7-c167-4e2d-b092-638ecdb637ce
98751ac0-98bc-443f-be05-17f03c42101a	b6222b9f-93ce-492d-97c7-cd4165912804
98751ac0-98bc-443f-be05-17f03c42101a	caeafe4f-fce0-4a4e-97e6-3ad857dcaa95
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	dfc63043-c855-4cdf-8a2f-5cded613766d
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	78f6afd2-3d2b-4396-aade-87777de434d3
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	b6359355-ef13-469f-8fad-dc11d659a93a
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	3259bd25-4a2d-46c5-bdbd-0b227503779e
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	ec31694f-6ae8-4006-a5c9-64ba4e789fa2
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	1f270045-2a76-4062-ad4f-a23c84a7afa1
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	6a287851-857e-4ec8-816a-dd9be9fe3116
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	d7280cf7-95f0-4ef8-a79e-d6da36eb7953
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	7e00741f-427d-4224-844f-c7a5b8c328dd
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	53ac078f-dac9-4a93-99cc-1dcc751a98d2
f02a317e-026c-4d13-bfbf-fa5c608d2352	dfc63043-c855-4cdf-8a2f-5cded613766d
f02a317e-026c-4d13-bfbf-fa5c608d2352	226bc708-130a-490c-8232-d5f696f50e9c
f02a317e-026c-4d13-bfbf-fa5c608d2352	78f6afd2-3d2b-4396-aade-87777de434d3
f02a317e-026c-4d13-bfbf-fa5c608d2352	3259bd25-4a2d-46c5-bdbd-0b227503779e
f02a317e-026c-4d13-bfbf-fa5c608d2352	da006819-7974-4154-99c4-518cff7c8588
f02a317e-026c-4d13-bfbf-fa5c608d2352	a6ca22cc-171c-4e82-9da4-0f76973f3d50
7d3784cc-1512-4685-94fa-ae44878b0f83	1f270045-2a76-4062-ad4f-a23c84a7afa1
7d3784cc-1512-4685-94fa-ae44878b0f83	7ba9ce70-096b-436b-8987-911498799ab4
7d3784cc-1512-4685-94fa-ae44878b0f83	6a287851-857e-4ec8-816a-dd9be9fe3116
7d3784cc-1512-4685-94fa-ae44878b0f83	0b092c6e-e7b8-4daf-abe0-bfdcb11d0326
7d3784cc-1512-4685-94fa-ae44878b0f83	0e147599-c83f-4c10-a0d2-4b8277aa1520
7d3784cc-1512-4685-94fa-ae44878b0f83	c89af083-9dbe-4df0-a84e-1c488ece329d
7d3784cc-1512-4685-94fa-ae44878b0f83	dba6a6b7-02f3-41fa-b3e0-3671042134f7
7d3784cc-1512-4685-94fa-ae44878b0f83	b6222b9f-93ce-492d-97c7-cd4165912804
7d3784cc-1512-4685-94fa-ae44878b0f83	caeafe4f-fce0-4a4e-97e6-3ad857dcaa95
7d3784cc-1512-4685-94fa-ae44878b0f83	d8bc176b-79dd-4d15-938d-48474984d023
8ea87eea-913e-4d93-b2d5-393a323ed9f6	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
8ea87eea-913e-4d93-b2d5-393a323ed9f6	8224f627-d251-4878-9212-8bace8f01db6
8ea87eea-913e-4d93-b2d5-393a323ed9f6	78f6afd2-3d2b-4396-aade-87777de434d3
8ea87eea-913e-4d93-b2d5-393a323ed9f6	b6359355-ef13-469f-8fad-dc11d659a93a
8ea87eea-913e-4d93-b2d5-393a323ed9f6	1f270045-2a76-4062-ad4f-a23c84a7afa1
8ea87eea-913e-4d93-b2d5-393a323ed9f6	6a287851-857e-4ec8-816a-dd9be9fe3116
8ea87eea-913e-4d93-b2d5-393a323ed9f6	d7280cf7-95f0-4ef8-a79e-d6da36eb7953
8ea87eea-913e-4d93-b2d5-393a323ed9f6	9fa42c00-b56c-4097-9a0c-10fcb646daaa
8ea87eea-913e-4d93-b2d5-393a323ed9f6	98da3cb5-4f7f-4fdb-9dae-45a96a74c098
8ea87eea-913e-4d93-b2d5-393a323ed9f6	6e38025e-ac56-4a6a-adb0-5a70ad140630
8ea87eea-913e-4d93-b2d5-393a323ed9f6	797ece9e-1bb0-42d9-b8b7-623953119902
8ea87eea-913e-4d93-b2d5-393a323ed9f6	3d3df6ea-d93d-4d52-b932-bd33b2b93133
8ea87eea-913e-4d93-b2d5-393a323ed9f6	a6ca22cc-171c-4e82-9da4-0f76973f3d50
8ea87eea-913e-4d93-b2d5-393a323ed9f6	b6222b9f-93ce-492d-97c7-cd4165912804
8ea87eea-913e-4d93-b2d5-393a323ed9f6	caeafe4f-fce0-4a4e-97e6-3ad857dcaa95
8ea87eea-913e-4d93-b2d5-393a323ed9f6	d8bc176b-79dd-4d15-938d-48474984d023
52436803-42cf-419a-a380-f1578fc3c1a9	dfc63043-c855-4cdf-8a2f-5cded613766d
52436803-42cf-419a-a380-f1578fc3c1a9	319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78
52436803-42cf-419a-a380-f1578fc3c1a9	226bc708-130a-490c-8232-d5f696f50e9c
52436803-42cf-419a-a380-f1578fc3c1a9	78f6afd2-3d2b-4396-aade-87777de434d3
52436803-42cf-419a-a380-f1578fc3c1a9	1f270045-2a76-4062-ad4f-a23c84a7afa1
52436803-42cf-419a-a380-f1578fc3c1a9	6a287851-857e-4ec8-816a-dd9be9fe3116
52436803-42cf-419a-a380-f1578fc3c1a9	b8efdf1b-ea1e-4625-ac8f-811b96b319b3
52436803-42cf-419a-a380-f1578fc3c1a9	da006819-7974-4154-99c4-518cff7c8588
52436803-42cf-419a-a380-f1578fc3c1a9	eeb8cec7-c167-4e2d-b092-638ecdb637ce
52436803-42cf-419a-a380-f1578fc3c1a9	3d3df6ea-d93d-4d52-b932-bd33b2b93133
52436803-42cf-419a-a380-f1578fc3c1a9	a6ca22cc-171c-4e82-9da4-0f76973f3d50
52436803-42cf-419a-a380-f1578fc3c1a9	dba6a6b7-02f3-41fa-b3e0-3671042134f7
52436803-42cf-419a-a380-f1578fc3c1a9	b6222b9f-93ce-492d-97c7-cd4165912804
e82ae06d-9a99-43a1-961a-b560ec726b06	1f270045-2a76-4062-ad4f-a23c84a7afa1
e82ae06d-9a99-43a1-961a-b560ec726b06	7ba9ce70-096b-436b-8987-911498799ab4
e82ae06d-9a99-43a1-961a-b560ec726b06	6a287851-857e-4ec8-816a-dd9be9fe3116
e82ae06d-9a99-43a1-961a-b560ec726b06	0a1c6e47-78c3-44c4-9f5a-285b19ba829c
e82ae06d-9a99-43a1-961a-b560ec726b06	1f99f68c-e9e9-4ce6-8375-bc2653c009a2
e82ae06d-9a99-43a1-961a-b560ec726b06	240f4f16-3543-4b34-8857-e7d44cd4d1a0
e82ae06d-9a99-43a1-961a-b560ec726b06	6e38025e-ac56-4a6a-adb0-5a70ad140630
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menus (id, date, creneau, is_published, published_at, publication_limite, organisation_id, created_at, updated_at, photo_url) FROM stdin;
ee7396f9-8e62-46d0-ad48-222a134f61b2	2026-04-15	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 20:56:15.116742	2026-04-21 20:56:15.116742	\N
9e5ab909-ca8c-4f08-8a03-c578a8ed79a2	2026-04-15	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 20:56:15.137667	2026-04-21 20:56:15.137667	\N
3bae2a14-bc15-4c1a-813c-e80a7c22e981	2026-04-15	EVENING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 20:56:15.14946	2026-04-21 20:56:15.14946	\N
6f041b47-c0e0-4fe3-bfed-e14a58afc3ec	2026-04-21	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 20:56:28.873711	2026-04-21 20:56:28.873711	\N
21115772-f24a-4da2-8038-bb0a1c63eb28	2026-04-16	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 20:56:54.79714	2026-04-21 20:56:54.79714	\N
cdb4a201-71ac-4d40-8ccd-fca139017bd5	2026-04-16	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 20:56:54.814352	2026-04-21 20:56:54.814352	\N
8fb38991-d066-4d4f-a092-29fd946e1a0e	2026-04-16	EVENING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 20:56:54.823128	2026-04-21 20:56:54.823128	\N
a7e57939-95ca-4ba3-83fe-90fca79de9fa	2026-04-21	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 21:21:06.97657	2026-04-21 21:21:06.97657	\N
d34398db-33a3-4170-87b7-fad9564eecfe	2026-04-22	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 21:21:29.391243	2026-04-21 21:21:29.391243	\N
1a4584c6-0b22-4b5e-85f4-130093570825	2026-04-22	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 21:21:29.404256	2026-04-21 21:21:29.404256	\N
d3a6ed39-4cc5-40ae-8fae-a08662c76e5f	2026-04-22	EVENING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 21:21:29.41166	2026-04-21 21:21:29.41166	\N
98862972-4eb3-4c16-927a-ff4df177036e	2026-04-23	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 21:22:06.421639	2026-04-21 21:22:06.421639	\N
9bc3f113-a5bd-4b3d-8457-90c335705ef5	2026-04-23	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 21:22:06.438969	2026-04-21 21:22:06.438969	\N
8ce151db-219d-4af3-a2f7-5c030dd5a866	2026-04-23	EVENING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-21 21:22:06.450347	2026-04-21 21:22:06.450347	\N
533fb89c-d4af-416c-b029-7ff2f4a7e981	2026-04-24	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-22 08:27:57.0646	2026-04-22 08:27:57.0646	\N
0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3	2026-04-29	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-22 11:37:55.868812	2026-04-22 11:37:55.868812	\N
9537b69f-33bd-4980-9163-67109ba591ab	2026-04-27	MORNING	f	\N	\N	f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	2026-04-27 12:11:14.990076	2026-04-27 12:11:14.990076	\N
488a9f08-fa60-4f60-9c7b-8c8521afeb5e	2026-04-27	NOON	f	\N	\N	f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	2026-04-27 12:11:15.011861	2026-04-27 12:11:15.011861	\N
8915adca-a23c-4e33-aabb-c1aa77e461d3	2026-04-27	EVENING	f	\N	\N	f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	2026-04-27 12:11:15.019503	2026-04-27 12:11:15.019503	\N
49e80d54-467d-48d0-a767-95aebe17d137	2026-04-27	SNACK	f	\N	\N	f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	2026-04-27 12:11:15.02717	2026-04-27 12:11:15.02717	\N
98751ac0-98bc-443f-be05-17f03c42101a	2026-04-27	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-27 13:10:06.29965	2026-04-27 13:10:06.29965	\N
5e7ace0e-f621-4c1b-b7c9-fe51be3291e3	2026-04-27	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-27 13:10:23.922431	2026-04-27 13:10:23.922431	\N
f02a317e-026c-4d13-bfbf-fa5c608d2352	2026-04-27	EVENING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-27 13:10:23.931277	2026-04-27 13:10:23.931277	\N
7d3784cc-1512-4685-94fa-ae44878b0f83	2026-04-28	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-27 13:11:07.807718	2026-04-27 13:11:07.807718	\N
8ea87eea-913e-4d93-b2d5-393a323ed9f6	2026-04-28	NOON	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-27 13:11:07.820207	2026-04-27 13:11:07.820207	\N
52436803-42cf-419a-a380-f1578fc3c1a9	2026-04-28	EVENING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-27 13:11:07.832253	2026-04-27 13:11:07.832253	\N
e82ae06d-9a99-43a1-961a-b560ec726b06	2026-04-29	MORNING	f	\N	\N	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-27 16:34:58.690454	2026-04-27 16:34:58.690454	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, titre, message, canal, is_read, read_at, action_url, metadata, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: order_dishes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_dishes ("ordersId", "dishesId") FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, numero_commande, qr_code_token, statut, creneau, date_livraison, montant_total, montant_subvention, montant_employe, methode_paiement, points_gagnes, date_recuperation, recupere_par, employe_id, organisation_id, created_at, updated_at, is_guest, guest_info) FROM stdin;
\.


--
-- Data for Name: organisations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisations (id, slug, nom, logo_url, couleur_primaire, couleur_secondaire, mode_gestion_menu, subvention_type, subvention_valeur, subvention_plafond_mensuel, is_active, created_at, updated_at, prix_min_plats, prix_max_plats, prix_max_menu, financial_mode, is_guest_order_enabled, guest_config, guest_order_start_time, guest_order_end_time, order_day_offset) FROM stdin;
b0f44923-3897-4f11-923f-4e5659b897e1	orange-ci	Orange Côte d'Ivoire	\N	#FF7900	#000000	MMS	PERCENTAGE	50.00	\N	t	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	0.00	0.00	0.00	DEBT	f	\N	\N	\N	0
b0f44923-3897-4f11-923f-4e5659b897e4	cie-sodeci	CIE-SODECI	\N	#003366	#FFFFFF	MMS	FULL	10000.00	\N	t	2026-04-11 19:03:41.863629	2026-04-21 20:30:08.927241	0.00	10000.00	10000.00	DEBT	f	\N	\N	\N	0
b0f44923-3897-4f11-923f-4e5659b897e2	nsia-banque	NSIA Banque	\N	#004A99	#D4AF37	MMS	FIXED	1500.00	\N	t	2026-04-11 19:03:41.863629	2026-04-27 12:03:58.502472	0.00	0.00	0.00	DEBT	t	{"fields": [{"id": "1777291410821", "type": "text", "label": "Nom ", "required": true}, {"id": "1777291418077", "type": "text", "label": "Prénom", "required": true}, {"id": "1777291422622", "type": "text", "label": "Numéro de téléphone", "required": true}, {"id": "1777291432596", "type": "text", "label": "Numéro de chambre", "required": true}]}	00:00	23:59	0
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	demo-sarl	Entreprise Demo SARL	\N	#E87722	#1A1A2E	MMS	FIXED	10000.00	\N	t	2026-04-11 20:09:38.851313	2026-04-27 14:38:32.105305	10.00	10000.00	10000.00	DEBT	t	{"fields": [{"id": "1777300680856", "type": "text", "label": "Nom", "required": true}, {"id": "1777300683614", "type": "text", "label": "Numéro de téléphone", "required": true}, {"id": "1777300691073", "type": "text", "label": "Numéro de chambre", "required": true}]}	00:00	23:59	0
f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	togoom-corp	TOGOOM CORP	\N	#FF6B00	#1A1A2E	MMS	FIXED	10000.00	\N	t	2026-04-21 12:04:45.759261	2026-04-27 16:32:59.445203	0.00	10000.00	10000.00	DEBT	t	{"fields": [{"id": "1777290969431", "type": "text", "label": "Nom", "required": true}, {"id": "1777290973966", "type": "text", "label": "Numéro de téléphone", "required": true}, {"id": "1777290984032", "type": "text", "label": "Chambre", "required": true}]}	08:00	20:00	0
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, reference, methode, statut, montant, telephone, provider_transaction_id, provider_response, error_message, order_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, general, branding, notifs, security, org, created_at, updated_at, dietary) FROM stdin;
1	{"phone": "+225 27 XX XX XX XX", "currency": "FCFA (XOF)", "timezone": "Africa/Abidjan", "contactEmail": "admin@mms.ci", "platformName": "MMS — Matin Midi Soir"}	{"logoUrl": "https://mms.ci/logo.png", "displayName": "MMS Admin", "primaryColor": "#002ad9"}	{"lowStock": true, "dailyReport": true, "lateDelivery": true, "paymentFailed": true, "newRegistration": true}	{"auditLogs": true, "autoLogout": false, "jwtExpiration": "7d", "twoFactorAuth": true}	{"rccm": "CI-ABJ-2024-B-12345", "address": "Cocody, Abidjan, Côte d'Ivoire", "companyName": "Matin Midi Soir SARL", "noonService": "11:30 – 14:00", "eveningService": "18:00 – 21:00", "morningService": "07:00 – 10:00"}	2026-04-20 22:40:08.168847	2026-04-21 10:30:00.9	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, prenom, nom, email, password_hash, role, telephone, avatar_url, service, otp_code, otp_expires_at, loyalty_points, loyalty_expires_at, fcm_token, is_active, is_first_login, organisation_id, created_at, updated_at, regimes, allergies) FROM stdin;
8d9e5f6f-a7cb-463b-9721-a123cf1815a6	Awa	Koné	awa@nsia.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	ADMIN_CLIENT	\N	\N	\N	\N	\N	0	\N	\N	t	f	b0f44923-3897-4f11-923f-4e5659b897e2	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	\N
63264bfa-cfa8-4276-8e77-a806e73c0a31	Koffi	Kouassi	koffi@orange.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	EMPLOYEE	\N	\N	\N	\N	\N	0	\N	\N	t	f	b0f44923-3897-4f11-923f-4e5659b897e1	2026-04-11 19:03:41.863629	2026-04-11 19:03:41.863629	\N	\N
22222222-2222-2222-2222-222222222222	Fatou	Admin	admin@demo.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	ADMIN_CLIENT	\N	\N	\N	\N	\N	0	\N	\N	t	f	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-11 20:09:38.851313	2026-04-11 20:09:38.851313	\N	\N
33333333-3333-3333-3333-333333333333	Koffi	Salarié	koffi@demo.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	EMPLOYEE	\N	\N	\N	\N	\N	50	\N	\N	t	f	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-11 20:09:38.851313	2026-04-11 20:09:38.851313	\N	\N
33333333-3333-3333-3333-333333333334	Koffi	Salarié	koff@demo.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	EMPLOYEE	\N	\N	\N	\N	\N	50	\N	\N	t	f	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	2026-04-11 20:44:46.760597	2026-04-11 20:44:46.760597	\N	\N
11111111-1111-1111-1111-111111111111	Jean	Cuisinier	chef@mms.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	COOK	\N	\N	\N	\N	\N	0	\N	\N	t	f	f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	2026-04-11 20:09:38.851313	2026-04-11 20:09:38.851313	\N	\N
77b7f4e0-5f5e-4948-be5a-9eea69b4e991	ADMI	SIMPLE	admin1@org.com	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	EMPLOYEE				\N	\N	0	\N	\N	t	f	b0f44923-3897-4f11-923f-4e5659b897e1	2026-04-20 18:19:01.440773	2026-04-20 18:19:01.440773	\N	\N
f965ff2d-526c-4a25-96a2-65d761f8c282	Tog	TOGOOM	admin@tog.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	ADMIN_CLIENT	+225 0708000000	\N	\N	\N	\N	0	\N	\N	t	f	f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	2026-04-21 12:04:45.791637	2026-04-21 12:04:45.791637	\N	\N
44444444-4444-4444-4444-444444444444	Moussa	Serveur	moussa.serveur@tog.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	ADMIN_MMS				\N	\N	0	\N	\N	t	f	f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b	2026-04-11 20:09:38.851313	2026-04-21 12:09:19.004756	\N	\N
00000000-0000-0000-0000-000000000001	Super	Admin	admin@super.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	SUPER_ADMIN				\N	\N	0	\N	\N	t	f	\N	2026-04-11 17:42:51.074632	2026-04-21 12:09:37.457279	\N	\N
00000000-0000-0000-0000-000000000002	AMIN	KADIM	amin@demo.ci	$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2	EMPLOYEE	\N	\N	\N	\N	\N	0	\N	\N	t	f	\N	2026-04-22 09:13:47.762511	2026-04-22 09:13:47.762511	\N	\N
\.


--
-- Data for Name: wallet_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wallet_transactions (id, type, montant, solde_apres, description, reference, wallet_id, created_at) FROM stdin;
\.


--
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wallets (id, solde, is_active, user_id, created_at, updated_at) FROM stdin;
55555555-5555-5555-5555-555555555555	15000.00	t	33333333-3333-3333-3333-333333333333	2026-04-11 20:09:38.851313	2026-04-11 20:09:38.851313
\.


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: settings PK_0669fe20e252eb692bf4d344975; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY (id);


--
-- Name: menu_dishes PK_18bfc4e09bf2cbb7676749733c0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_dishes
    ADD CONSTRAINT "PK_18bfc4e09bf2cbb7676749733c0" PRIMARY KEY ("menusId", "dishesId");


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: order_dishes PK_33b7fd956d2aeae4f9bb927c5af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_dishes
    ADD CONSTRAINT "PK_33b7fd956d2aeae4f9bb927c5af" PRIMARY KEY ("ordersId", "dishesId");


--
-- Name: menus PK_3fec3d93327f4538e0cbd4349c4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);


--
-- Name: wallet_transactions PK_5120f131bde2cda940ec1a621db; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT "PK_5120f131bde2cda940ec1a621db" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: organisations PK_7bf54cba378d5b2f1d4c10ef4df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT "PK_7bf54cba378d5b2f1d4c10ef4df" PRIMARY KEY (id);


--
-- Name: wallets PK_8402e5df5a30a229380e83e4f7e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: loyalty_transactions PK_df453f678b7575221b335673362; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "PK_df453f678b7575221b335673362" PRIMARY KEY (id);


--
-- Name: dishes PK_f4748c8e8382ad34ef517520b7b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT "PK_f4748c8e8382ad34ef517520b7b" PRIMARY KEY (id);


--
-- Name: orders UQ_423fe0283bf2886a0203868b82a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "UQ_423fe0283bf2886a0203868b82a" UNIQUE (numero_commande);


--
-- Name: orders UQ_6f34e2d7b0027d9a080032e3dee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "UQ_6f34e2d7b0027d9a080032e3dee" UNIQUE (qr_code_token);


--
-- Name: payments UQ_866ddee0e17d9385b4e3b86851d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "UQ_866ddee0e17d9385b4e3b86851d" UNIQUE (reference);


--
-- Name: wallets UQ_92558c08091598f7a4439586cda; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "UQ_92558c08091598f7a4439586cda" UNIQUE (user_id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: organisations UQ_db67ac918db3917134d0c9edbb3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT "UQ_db67ac918db3917134d0c9edbb3" UNIQUE (slug);


--
-- Name: IDX_6babcbf5e6b029912bf2affe93; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6babcbf5e6b029912bf2affe93" ON public.order_dishes USING btree ("dishesId");


--
-- Name: IDX_d9d64b5d04adb5d4f78a36fc4e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d9d64b5d04adb5d4f78a36fc4e" ON public.menu_dishes USING btree ("menusId");


--
-- Name: IDX_de9763e4823ea322c6c63c946a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_de9763e4823ea322c6c63c946a" ON public.menu_dishes USING btree ("dishesId");


--
-- Name: IDX_ef8b013f9a9bb1a383b061f7e4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ef8b013f9a9bb1a383b061f7e4" ON public.order_dishes USING btree ("ordersId");


--
-- Name: users FK_2fc4294f8ec97da71d587dc5577; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_2fc4294f8ec97da71d587dc5577" FOREIGN KEY (organisation_id) REFERENCES public.organisations(id);


--
-- Name: payments FK_427785468fb7d2733f59e7d7d39; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_427785468fb7d2733f59e7d7d39" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_dishes FK_6babcbf5e6b029912bf2affe934; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_dishes
    ADD CONSTRAINT "FK_6babcbf5e6b029912bf2affe934" FOREIGN KEY ("dishesId") REFERENCES public.dishes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: wallets FK_92558c08091598f7a4439586cda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications FK_9a8a82462cab47c73d25f49261f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: menus FK_b2b69bb46f2d4508debf9b7af10; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "FK_b2b69bb46f2d4508debf9b7af10" FOREIGN KEY (organisation_id) REFERENCES public.organisations(id);


--
-- Name: payments FK_b2f7b823a21562eeca20e72b006; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: loyalty_transactions FK_c4d462b2bc48d9304b31bcab46b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "FK_c4d462b2bc48d9304b31bcab46b" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: wallet_transactions FK_c57d19129968160f4db28fc8b28; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT "FK_c57d19129968160f4db28fc8b28" FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);


--
-- Name: orders FK_d1fb0cec7324a7715d1662523c7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_d1fb0cec7324a7715d1662523c7" FOREIGN KEY (organisation_id) REFERENCES public.organisations(id);


--
-- Name: menu_dishes FK_d9d64b5d04adb5d4f78a36fc4ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_dishes
    ADD CONSTRAINT "FK_d9d64b5d04adb5d4f78a36fc4ee" FOREIGN KEY ("menusId") REFERENCES public.menus(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_dishes FK_de9763e4823ea322c6c63c946aa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_dishes
    ADD CONSTRAINT "FK_de9763e4823ea322c6c63c946aa" FOREIGN KEY ("dishesId") REFERENCES public.dishes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_dishes FK_ef8b013f9a9bb1a383b061f7e40; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_dishes
    ADD CONSTRAINT "FK_ef8b013f9a9bb1a383b061f7e40" FOREIGN KEY ("ordersId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders FK_f53f8e19d71804814c87ace8883; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_f53f8e19d71804814c87ace8883" FOREIGN KEY (employe_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

