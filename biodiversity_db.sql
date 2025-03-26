--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

-- Started on 2025-03-23 15:58:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;



--
-- TOC entry 5141 (class 1262 OID 16552)
-- Name: biodiversity_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE biodiversity_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';


ALTER DATABASE biodiversity_db OWNER TO postgres;

\connect biodiversity_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 241 (class 1259 OID 17180)
-- Name: cultural_content; Type: TABLE; Schema: public; Owner: postgres
--

-- TYPES
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE fact_category AS ENUM (
    'habitat',
    'behavior',
    'diet',
    'reproduction',
    'conservation',
    'distribution',
    'physical_characteristics',
    'ecological_role',
    'human_use',
    'other'
);
-- Create enum for content types
CREATE TYPE content_type AS ENUM ('myth', 'legend', 'proverb');

-- Create enum for content status
CREATE TYPE content_status AS ENUM ('pending', 'approved', 'rejected', 'archived');

-- Create enum for content languages
CREATE TYPE content_language AS ENUM ('en', 'rw', 'sw');

CREATE TABLE public.cultural_content (
    id integer NOT NULL,
    species_id character varying(255),
    content_type public.content_type NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    language public.content_language DEFAULT 'en'::public.content_language NOT NULL,
    source character varying(255),
    author_id integer NOT NULL,
    status public.content_status DEFAULT 'pending'::public.content_status NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by integer,
    upvotes integer DEFAULT 0 NOT NULL,
    downvotes integer DEFAULT 0 NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT valid_content CHECK ((length(content) >= 10))
);


ALTER TABLE public.cultural_content OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17209)
-- Name: cultural_content_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cultural_content_history (
    id integer NOT NULL,
    content_id integer,
    modified_by integer,
    modification_type character varying(20) NOT NULL,
    old_status public.content_status,
    new_status public.content_status,
    old_content text,
    new_content text,
    modified_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reason text,
    content_id_reference integer
);


ALTER TABLE public.cultural_content_history OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 17208)
-- Name: cultural_content_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cultural_content_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cultural_content_history_id_seq OWNER TO postgres;

--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 242
-- Name: cultural_content_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cultural_content_history_id_seq OWNED BY public.cultural_content_history.id;


--
-- TOC entry 240 (class 1259 OID 17179)
-- Name: cultural_content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cultural_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cultural_content_id_seq OWNER TO postgres;

--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 240
-- Name: cultural_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cultural_content_id_seq OWNED BY public.cultural_content.id;


--
-- TOC entry 247 (class 1259 OID 25312)
-- Name: cultural_content_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cultural_content_votes (
    id integer NOT NULL,
    content_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    vote_direction character varying(4) DEFAULT 'up'::character varying NOT NULL,
    CONSTRAINT cultural_content_votes_vote_direction_check CHECK (((vote_direction)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying])::text[])))
);


ALTER TABLE public.cultural_content_votes OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 25311)
-- Name: cultural_content_votes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cultural_content_votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cultural_content_votes_id_seq OWNER TO postgres;

--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 246
-- Name: cultural_content_votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cultural_content_votes_id_seq OWNED BY public.cultural_content_votes.id;


--
-- TOC entry 245 (class 1259 OID 17236)
-- Name: debug_species_ids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.debug_species_ids (
    id integer NOT NULL,
    submitted_id character varying(255),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.debug_species_ids OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 17235)
-- Name: debug_species_ids_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.debug_species_ids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.debug_species_ids_id_seq OWNER TO postgres;

--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 244
-- Name: debug_species_ids_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.debug_species_ids_id_seq OWNED BY public.debug_species_ids.id;


--
-- TOC entry 231 (class 1259 OID 16914)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16913)
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 230
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- TOC entry 251 (class 1259 OID 25376)
-- Name: search_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_history (
    id integer NOT NULL,
    query_text character varying(255) NOT NULL,
    user_id integer,
    session_id character varying(255),
    ip_address character varying(45),
    result_count integer,
    searched_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.search_history OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 25375)
-- Name: search_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.search_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.search_history_id_seq OWNER TO postgres;

--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 250
-- Name: search_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.search_history_id_seq OWNED BY public.search_history.id;


--
-- TOC entry 226 (class 1259 OID 16790)
-- Name: species; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.species (
    id integer NOT NULL,
    composite_key character varying(255) NOT NULL,
    gbif_key integer NOT NULL,
    scientific_name character varying(255) NOT NULL,
    vernacular_names text[],
    kingdom character varying(255),
    kingdom_key integer,
    phylum character varying(255),
    phylum_key integer,
    class character varying(255),
    class_key integer,
    order_name character varying(255),
    order_key integer,
    family character varying(255),
    family_key integer,
    genus character varying(255),
    genus_key integer,
    specific_epithet character varying(255),
    taxonomic_status character varying(255),
    nomenclatural_status character varying(255),
    habitat text,
    threat_status character varying(50),
    description text,
    image_url text,
    image_source character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sound_url character varying(500),
    location text
);


ALTER TABLE public.species OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17052)
-- Name: species_facts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.species_facts (
    id integer NOT NULL,
    species_id character varying(255),
    category public.fact_category NOT NULL,
    fact text NOT NULL,
    source_reference text,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by integer,
    CONSTRAINT valid_fact CHECK ((length(fact) >= 10))
);


ALTER TABLE public.species_facts OWNER TO postgres;

--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE species_facts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.species_facts IS 'Stores verified scientific facts about species';


--
-- TOC entry 237 (class 1259 OID 17079)
-- Name: species_facts_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.species_facts_history (
    id integer NOT NULL,
    fact_id integer,
    modified_by integer,
    modification_type character varying(20) NOT NULL,
    old_content text,
    new_content text,
    old_category public.fact_category,
    new_category public.fact_category,
    modified_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reason text
);


ALTER TABLE public.species_facts_history OWNER TO postgres;

--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE species_facts_history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.species_facts_history IS 'Tracks all modifications to species facts for auditing';


--
-- TOC entry 236 (class 1259 OID 17078)
-- Name: species_facts_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.species_facts_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.species_facts_history_id_seq OWNER TO postgres;

--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 236
-- Name: species_facts_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.species_facts_history_id_seq OWNED BY public.species_facts_history.id;


--
-- TOC entry 234 (class 1259 OID 17051)
-- Name: species_facts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.species_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.species_facts_id_seq OWNER TO postgres;

--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 234
-- Name: species_facts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.species_facts_id_seq OWNED BY public.species_facts.id;


--
-- TOC entry 225 (class 1259 OID 16789)
-- Name: species_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.species_id_seq OWNER TO postgres;

--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 225
-- Name: species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.species_id_seq OWNED BY public.species.id;


--
-- TOC entry 249 (class 1259 OID 25353)
-- Name: species_views; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.species_views (
    id integer NOT NULL,
    species_id character varying(255),
    user_id integer,
    session_id character varying(255),
    ip_address character varying(45),
    viewed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.species_views OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 25352)
-- Name: species_views_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.species_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.species_views_id_seq OWNER TO postgres;

--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 248
-- Name: species_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.species_views_id_seq OWNED BY public.species_views.id;


--
-- TOC entry 224 (class 1259 OID 16775)
-- Name: taxonomic_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taxonomic_keys (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    rank character varying(50) NOT NULL,
    taxon_key integer NOT NULL,
    parent_key integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.taxonomic_keys OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16774)
-- Name: taxonomic_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taxonomic_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.taxonomic_keys_id_seq OWNER TO postgres;

--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 223
-- Name: taxonomic_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taxonomic_keys_id_seq OWNED BY public.taxonomic_keys.id;


--
-- TOC entry 229 (class 1259 OID 16899)
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    user_id integer NOT NULL,
    full_name character varying(100),
    bio text,
    location character varying(100),
    organization character varying(100),
    expertise_area character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17158)
-- Name: user_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_stats (
    user_id integer NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    quizzes_completed integer DEFAULT 0 NOT NULL,
    correct_answers integer DEFAULT 0 NOT NULL,
    badges jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_stats OWNER TO postgres;

--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE user_stats; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_stats IS 'Stores user XP, quiz completion statistics, and badges';


--
-- TOC entry 228 (class 1259 OID 16882)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    is_active boolean DEFAULT true,
    email_verified boolean DEFAULT false,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    google_id character varying(255),
    profile_image_url text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16881)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 233 (class 1259 OID 16927)
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_tokens (
    id integer NOT NULL,
    user_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.verification_tokens OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16926)
-- Name: verification_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verification_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 232
-- Name: verification_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verification_tokens_id_seq OWNED BY public.verification_tokens.id;


--
-- TOC entry 4848 (class 2604 OID 17183)
-- Name: cultural_content id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content ALTER COLUMN id SET DEFAULT nextval('public.cultural_content_id_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 17212)
-- Name: cultural_content_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_history ALTER COLUMN id SET DEFAULT nextval('public.cultural_content_history_id_seq'::regclass);


--
-- TOC entry 4859 (class 2604 OID 25315)
-- Name: cultural_content_votes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_votes ALTER COLUMN id SET DEFAULT nextval('public.cultural_content_votes_id_seq'::regclass);


--
-- TOC entry 4857 (class 2604 OID 17239)
-- Name: debug_species_ids id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.debug_species_ids ALTER COLUMN id SET DEFAULT nextval('public.debug_species_ids_id_seq'::regclass);


--
-- TOC entry 4833 (class 2604 OID 16917)
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- TOC entry 4864 (class 2604 OID 25379)
-- Name: search_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_history ALTER COLUMN id SET DEFAULT nextval('public.search_history_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 16793)
-- Name: species id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species ALTER COLUMN id SET DEFAULT nextval('public.species_id_seq'::regclass);


--
-- TOC entry 4837 (class 2604 OID 17055)
-- Name: species_facts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts ALTER COLUMN id SET DEFAULT nextval('public.species_facts_id_seq'::regclass);


--
-- TOC entry 4840 (class 2604 OID 17082)
-- Name: species_facts_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts_history ALTER COLUMN id SET DEFAULT nextval('public.species_facts_history_id_seq'::regclass);


--
-- TOC entry 4862 (class 2604 OID 25356)
-- Name: species_views id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_views ALTER COLUMN id SET DEFAULT nextval('public.species_views_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 16778)
-- Name: taxonomic_keys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxonomic_keys ALTER COLUMN id SET DEFAULT nextval('public.taxonomic_keys_id_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 16885)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4835 (class 2604 OID 16930)
-- Name: verification_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens ALTER COLUMN id SET DEFAULT nextval('public.verification_tokens_id_seq'::regclass);


--
-- TOC entry 5125 (class 0 OID 17180)
-- Dependencies: 241
-- Data for Name: cultural_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cultural_content VALUES (7, '5220063_1_359', 'myth', 'Spiritual Guardians', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'en', NULL, 4, 'pending', '2025-03-17 01:58:43.543705+02', '2025-03-18 13:24:58.964357+02', NULL, 0, 1, NULL);
INSERT INTO public.cultural_content VALUES (6, '2436448_1_359', 'myth', 'Gorilla', 'We used to pray to them', 'en', NULL, 4, 'pending', '2025-03-13 12:11:31.732558+02', '2025-03-19 12:12:24.060083+02', NULL, 1, 0, NULL);
INSERT INTO public.cultural_content VALUES (8, '5220063_1_359', 'myth', 'Spiritual Guides', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'en', NULL, 4, 'approved', '2025-03-17 02:21:50.714173+02', '2025-03-19 14:02:50.824823+02', NULL, 1, 1, NULL);
INSERT INTO public.cultural_content VALUES (9, '5220063_1_359', 'proverb', 'Hyena Rwanda proverb', 'A hyena in sheep''s clothing still hunts at dawn', 'en', '', 4, 'approved', '2025-03-17 14:21:16.502409+02', '2025-03-19 14:13:56.586969+02', 4, 2, 0, NULL);
INSERT INTO public.cultural_content VALUES (4, '5220063_1_359', 'myth', 'Test Title', 'This is test content that is at least 9 characters', 'en', 'Test source', 4, 'rejected', '2025-03-08 19:13:12.664744+02', '2025-03-22 12:29:15.136348+02', 4, 1, 0, '2025-03-19 15:02:49.963335+02');
INSERT INTO public.cultural_content VALUES (5, '2436124_1_359', 'myth', 'Mountain Gorilla Legend', 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', 'en', 'Local elders', 3, 'approved', '2025-03-13 11:46:52.129643+02', '2025-03-22 12:29:23.222044+02', 4, 0, 0, NULL);


--
-- TOC entry 5127 (class 0 OID 17209)
-- Dependencies: 243
-- Data for Name: cultural_content_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cultural_content_history VALUES (4, 4, 4, 'create', NULL, 'pending', NULL, 'This is test content that is at least 10 characters', '2025-03-08 19:13:12.664744+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (5, 5, 3, 'create', NULL, 'pending', NULL, 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', '2025-03-13 11:46:52.129643+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (6, 6, 4, 'create', NULL, 'pending', NULL, 'We used to pray to them', '2025-03-13 12:11:31.732558+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (7, 7, 4, 'create', NULL, 'pending', NULL, 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 01:58:43.543705+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (8, 8, 4, 'create', NULL, 'approved', NULL, 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 02:21:50.714173+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (9, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 11:21:23.594337+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (10, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 11:33:22.172213+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (11, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 11:33:24.900634+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (14, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:35.428539+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (15, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:37.524625+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (16, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:02:38.921453+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (17, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:40.424396+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (18, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:41.403712+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (19, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:42.220244+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (20, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:42.938482+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (21, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:43.433955+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (22, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:45.708064+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (23, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:45.708064+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (62, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:16:55.629842+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (64, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 14:10:15.41572+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (24, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:47.02522+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (25, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:02:48.554871+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (26, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:49.447628+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (27, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:50.292609+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (28, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:51.009855+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (29, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:51.427709+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (30, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:51.923243+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (31, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:52.392454+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (32, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:52.856444+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (33, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:53.837834+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (34, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:54.786724+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (35, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:56.759216+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (36, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:57.637975+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (37, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:58.558792+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (38, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:02:59.474396+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (39, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:00.32319+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (63, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 13:36:16.020148+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (65, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 14:10:18.135529+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (40, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:01.12916+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (41, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:01.848509+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (42, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:03.247381+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (43, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:03.247381+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (44, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:05.534607+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (45, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:06.364487+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (46, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:07.231477+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (47, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:08.004918+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (48, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:08.73671+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (49, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:11.065971+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (50, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:11.065971+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (51, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:16.018583+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (52, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:17.763926+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (53, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:17.763926+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (54, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 12:03:20.283415+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (55, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:25.284426+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (56, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:30.551737+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (57, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:31.954711+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (58, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:33.151054+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (59, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:34.350592+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (60, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:34.350592+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (61, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 12:03:37.481256+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (66, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 14:10:19.06399+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (67, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 14:10:21.94394+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (68, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 14:10:26.150269+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (69, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:29.352207+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (70, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:31.113656+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (71, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:31.983403+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (72, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:35.235505+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (73, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:37.223686+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (74, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 14:10:40.854917+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (75, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:42.132703+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (76, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:43.082605+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (77, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:44.092605+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (78, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:44.374758+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (79, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 14:10:46.001562+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (80, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 14:10:50.962847+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (81, 9, 4, 'create', NULL, 'approved', NULL, 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 14:21:16.502409+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (82, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 14:27:47.214816+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (83, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 14:27:48.707461+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (84, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 14:27:49.845702+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (85, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 14:27:50.510875+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (86, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 14:27:52.803479+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (87, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 15:07:50.464014+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (88, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 15:07:56.481304+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (89, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 15:08:02.369116+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (90, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 16:16:34.254678+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (91, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 16:16:40.933616+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (92, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 16:16:45.536013+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (93, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 16:16:47.792423+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (94, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 16:16:53.4725+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (95, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 16:16:54.163947+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (96, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 16:16:55.073366+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (97, 9, NULL, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheep’s clothing still hunts at dawn', '2025-03-17 16:16:56.536428+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (98, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 22:32:19.358557+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (99, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 22:32:21.587438+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (100, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 22:34:31.071162+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (101, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 22:34:35.185714+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (102, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 22:34:36.209191+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (103, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 22:34:37.066881+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (104, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 23:28:27.566787+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (105, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 23:28:32.027454+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (106, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-17 23:28:33.516675+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (107, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 23:28:34.60954+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (108, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-18 13:24:41.560271+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (109, 4, NULL, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 10 characters', '2025-03-18 13:24:54.987433+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (110, 7, NULL, 'update', 'pending', 'pending', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-18 13:24:58.964357+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (111, 6, NULL, 'update', 'pending', 'pending', 'We used to pray to them', 'We used to pray to them', '2025-03-19 12:12:24.060083+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (112, 4, 4, 'update', 'pending', 'pending', 'This is test content that is at least 10 characters', 'This is test content that is at least 9 characters', '2025-03-19 14:02:03.464963+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (113, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-19 14:02:47.962789+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (114, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-19 14:02:50.135649+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (115, 8, NULL, 'update', 'approved', 'approved', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-19 14:02:50.824823+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (116, 4, 4, 'delete', 'pending', NULL, 'This is test content that is at least 9 characters', NULL, '2025-03-19 14:03:56.499736+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (118, 4, 4, 'delete', 'pending', NULL, 'This is test content that is at least 9 characters', NULL, '2025-03-19 14:04:03.145818+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (120, 9, 4, 'update', 'approved', 'approved', 'A hyena in sheep’s clothing still hunts at dawn', 'A hyena in sheeps clothing still hunts at dawn', '2025-03-19 14:13:50.400746+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (121, 9, 4, 'update', 'approved', 'approved', 'A hyena in sheeps clothing still hunts at dawn', 'A hyena in sheep''s clothing still hunts at dawn', '2025-03-19 14:13:56.586969+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (122, 4, 4, 'delete', 'pending', NULL, 'This is test content that is at least 9 characters', NULL, '2025-03-19 14:14:06.273+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (124, 4, 4, 'delete', 'pending', NULL, 'This is test content that is at least 9 characters', NULL, '2025-03-19 14:19:31.486675+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (128, 4, 4, 'delete', 'pending', NULL, 'This is test content that is at least 9 characters', NULL, '2025-03-19 14:23:08.178276+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (141, 4, 4, 'update', 'pending', 'pending', 'This is test content that is at least 9 characters', 'This is test content that is at least 9 characters', '2025-03-19 15:02:49.963335+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (142, 4, 4, 'delete', 'pending', NULL, 'This is test content that is at least 9 characters', NULL, '2025-03-19 15:02:50.012414+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (143, 4, 4, 'status_change', 'pending', 'rejected', 'This is test content that is at least 9 characters', 'This is test content that is at least 9 characters', '2025-03-22 12:29:15.136348+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (144, 4, 4, 'status_change', 'pending', 'rejected', NULL, NULL, '2025-03-22 12:29:15.136348+02', 'this is test content', NULL);
INSERT INTO public.cultural_content_history VALUES (145, 5, 4, 'status_change', 'pending', 'approved', 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', '2025-03-22 12:29:23.222044+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (146, 5, 4, 'status_change', 'pending', 'approved', NULL, NULL, '2025-03-22 12:29:23.222044+02', NULL, NULL);


--
-- TOC entry 5131 (class 0 OID 25312)
-- Dependencies: 247
-- Data for Name: cultural_content_votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cultural_content_votes VALUES (43, 6, 4, '2025-03-19 12:12:24.060083+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (45, 8, 3, '2025-03-19 14:02:50.824823+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (28, 7, 4, '2025-03-17 14:10:42.132703+02', 'down');
INSERT INTO public.cultural_content_votes VALUES (30, 8, 4, '2025-03-17 14:10:46.001562+02', 'down');
INSERT INTO public.cultural_content_votes VALUES (25, 4, 4, '2025-03-17 14:10:26.150269+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (33, 9, 4, '2025-03-17 14:27:52.803479+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (39, 9, 3, '2025-03-17 16:16:54.163947+02', 'up');


--
-- TOC entry 5129 (class 0 OID 17236)
-- Dependencies: 245
-- Data for Name: debug_species_ids; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.debug_species_ids VALUES (1, '2436124_1_359', '2025-03-13 11:46:52.096288');
INSERT INTO public.debug_species_ids VALUES (2, '2436448_1_359', '2025-03-13 12:11:31.719848');
INSERT INTO public.debug_species_ids VALUES (3, '5220063_1_359', '2025-03-17 01:58:43.516982');
INSERT INTO public.debug_species_ids VALUES (4, '5220063_1_359', '2025-03-17 02:21:50.699237');
INSERT INTO public.debug_species_ids VALUES (5, '5220063_1_359', '2025-03-17 14:21:16.475953');


--
-- TOC entry 5116 (class 0 OID 16914)
-- Dependencies: 231
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5135 (class 0 OID 25376)
-- Dependencies: 251
-- Data for Name: search_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.search_history VALUES (1, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:11:20.163342+02');
INSERT INTO public.search_history VALUES (2, 'cheetah', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:11:44.456025+02');
INSERT INTO public.search_history VALUES (3, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:11:58.040159+02');
INSERT INTO public.search_history VALUES (4, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:29:20.662124+02');
INSERT INTO public.search_history VALUES (5, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:29:20.663746+02');


--
-- TOC entry 5111 (class 0 OID 16790)
-- Dependencies: 226
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.species VALUES (400, '98053677_1_null', 98053677, 'Canis familiaris', '{Dog}', 'Animalia', 1, NULL, NULL, 'Mammalia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Domestic dogs thrive in a variety of human-made environments—from bustling urban settings and suburban neighborhoods to rural farms and remote regions around the globe. Found in: Households worldwide, as well as in shelters, community spaces, and even as feral populations in some areas', 'Least Concern', 'The domestic dog (Canis lupus familiaris) is a highly versatile and widely beloved animal, renowned for its loyalty, intelligence, and adaptability. Descended from the gray wolf, dogs have been selectively bred over thousands of years, resulting in a vast array of breeds that vary dramatically in size, coat type, and temperament. Their acute senses—especially smell and hearing—coupled with their sociable nature, have made them excellent companions and invaluable working animals in roles ranging from herding and hunting to service and protection.', 'https://wildpedia-species-images.s3.us-east-1.amazonaws.com/species-images/1742657521444-250709844.webp', 'user_uploaded', '2025-03-20 16:31:03.516362', '2025-03-22 17:32:07.031514', NULL, NULL);


--
-- TOC entry 5120 (class 0 OID 17052)
-- Dependencies: 235
-- Data for Name: species_facts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5122 (class 0 OID 17079)
-- Dependencies: 237
-- Data for Name: species_facts_history; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5133 (class 0 OID 25353)
-- Dependencies: 249
-- Data for Name: species_views; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.species_views VALUES (4, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:30:37.829869+02');
INSERT INTO public.species_views VALUES (3, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:30:36.370219+02');
INSERT INTO public.species_views VALUES (5, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:29.596151+02');
INSERT INTO public.species_views VALUES (6, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:29.697453+02');
INSERT INTO public.species_views VALUES (7, '5481342_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:44.372993+02');
INSERT INTO public.species_views VALUES (8, '5481342_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:44.377632+02');
INSERT INTO public.species_views VALUES (9, '5481342_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:37:48.402126+02');
INSERT INTO public.species_views VALUES (10, '8659814_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:37:53.214822+02');
INSERT INTO public.species_views VALUES (11, '5218799_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:56:55.950621+02');
INSERT INTO public.species_views VALUES (12, '2436448_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 12:29:36.757144+02');
INSERT INTO public.species_views VALUES (13, '98053677_1_null', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:21:58.973574+02');
INSERT INTO public.species_views VALUES (14, '2437933_1_359', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:22:15.522521+02');
INSERT INTO public.species_views VALUES (15, '98053677_1_null', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:22:24.838875+02');
INSERT INTO public.species_views VALUES (16, '2440946_1_359', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:22:36.664636+02');
INSERT INTO public.species_views VALUES (17, '98053677_1_null', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:24:51.972337+02');
INSERT INTO public.species_views VALUES (18, '98053677_1_null', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:30:49.187825+02');
INSERT INTO public.species_views VALUES (19, '98053677_1_null', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:32:11.452318+02');
INSERT INTO public.species_views VALUES (20, '2436246_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:32:33.363332+02');
INSERT INTO public.species_views VALUES (21, '98053677_1_null', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:32:37.850619+02');


--
-- TOC entry 5109 (class 0 OID 16775)
-- Dependencies: 224
-- Data for Name: taxonomic_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.taxonomic_keys VALUES (1, 'Plantae', 'KINGDOM', 6, NULL, '2025-02-20 10:25:21.892709');
INSERT INTO public.taxonomic_keys VALUES (2, 'Animalia', 'KINGDOM', 1, NULL, '2025-02-20 10:25:23.422261');
INSERT INTO public.taxonomic_keys VALUES (3, 'Mammalia', 'CLASS', 359, 1, '2025-02-20 10:25:23.904844');
INSERT INTO public.taxonomic_keys VALUES (4, 'Chordata', 'PHYLUM', 44, 1, '2025-02-20 10:25:25.412622');
INSERT INTO public.taxonomic_keys VALUES (5, 'Insecta', 'CLASS', 216, 1, '2025-02-20 10:25:26.917814');
INSERT INTO public.taxonomic_keys VALUES (6, 'Aves', 'CLASS', 212, 1, '2025-02-20 10:25:28.423642');
INSERT INTO public.taxonomic_keys VALUES (7, 'Amphibia', 'CLASS', 131, 1, '2025-02-20 10:25:29.933525');
INSERT INTO public.taxonomic_keys VALUES (17, 'Squamata', 'CLASS', 11592253, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (18, 'Colubridae', 'FAMILY', 6172, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (19, 'Nerodia', 'GENUS', 2454456, 6172, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (23, 'Artiodactyla', 'ORDER', 731, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (24, 'Cervidae', 'FAMILY', 5298, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (25, 'Odocoileus', 'GENUS', 2440964, 5298, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (29, 'Carnivora', 'ORDER', 732, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (30, 'Felidae', 'FAMILY', 9703, 732, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (31, 'Panthera', 'GENUS', 2435194, 9703, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (42, 'Bovidae', 'FAMILY', 9614, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (43, 'Naemorhedus', 'GENUS', 2441009, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (48, 'Canidae', 'FAMILY', 9701, 732, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (49, 'Atelocynus', 'GENUS', 2434453, 9701, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (52, 'Testudines', 'CLASS', 11418114, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (53, 'Trionychidae', 'FAMILY', 5469, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (54, 'Pelodiscus', 'GENUS', 7236986, 5469, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (60, 'Neotragus', 'GENUS', 2441070, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (66, 'Oreotragus', 'GENUS', 2441043, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (76, 'Suidae', 'FAMILY', 5302, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (77, 'Phacochoerus', 'GENUS', 2441210, 5302, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (81, 'Scincidae', 'FAMILY', 9115, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (82, 'Trachylepis', 'GENUS', 3240904, 9115, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (85, 'Reptilia', 'CLASS', 358, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (86, 'Squamata', 'ORDER', 715, 358, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (87, 'Lamprophiidae', 'FAMILY', 5789868, 715, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (88, 'Hemirhagerrhis', 'GENUS', 2459060, 5789868, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (94, 'Profelis', 'GENUS', 5219400, 9703, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (103, 'Accipitriformes', 'ORDER', 7191147, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (104, 'Accipitridae', 'FAMILY', 2877, 7191147, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (105, 'Spizaetus', 'GENUS', 2480669, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (111, 'Accipiter', 'GENUS', 9405810, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (117, 'Capra', 'GENUS', 2441047, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (121, 'Lagomorpha', 'ORDER', 785, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (122, 'Ochotonidae', 'FAMILY', 5467, 785, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (123, 'Ochotona', 'GENUS', 2436951, 5467, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (127, 'Rodentia', 'ORDER', 1459, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (128, 'Muridae', 'FAMILY', 5510, 1459, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (129, 'Conilurus', 'GENUS', 2437958, 5510, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (135, 'Bison', 'GENUS', 2441175, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (139, 'Chiroptera', 'ORDER', 734, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (140, 'Emballonuridae', 'FAMILY', 9615, 734, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (141, 'Cormura', 'GENUS', 2433101, 9615, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (147, 'Dorcatragus', 'GENUS', 2441196, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (151, 'Gruiformes', 'ORDER', 1493, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (152, 'Rallidae', 'FAMILY', 9342, 1493, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (153, 'Aenigmatolimnas', 'GENUS', 2474652, 9342, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (157, 'Lacertidae', 'FAMILY', 5201, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (158, 'Thermophilus', 'GENUS', 2468992, 5201, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (164, 'Circaetus', 'GENUS', 2480661, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (168, 'Apodiformes', 'ORDER', 1448, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (169, 'Apodidae', 'FAMILY', 2993, 1448, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (170, 'Apus', 'GENUS', 2235048, 2993, '2025-03-06 01:48:23.938728');


--
-- TOC entry 5114 (class 0 OID 16899)
-- Dependencies: 229
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_profiles VALUES (3, 'Kenyua Scholar', NULL, 'Nairobi', 'Tsavo Trust', 'Student', '2025-02-20 13:10:04.574617', '2025-02-20 13:10:04.574617');
INSERT INTO public.user_profiles VALUES (5, 'postgres Kinyua', NULL, NULL, NULL, NULL, '2025-03-07 16:54:18.2609', '2025-03-07 16:54:18.2609');


--
-- TOC entry 5123 (class 0 OID 17158)
-- Dependencies: 239
-- Data for Name: user_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_stats VALUES (5, 0, 0, 0, '[]', '2025-03-07 16:54:22.829266+02', '2025-03-07 16:54:22.829266+02');
INSERT INTO public.user_stats VALUES (4, 180, 7, 18, '[{"name": "Quiz Novice", "type": "quiz_5", "awarded_at": "2025-03-13T10:34:29.143Z", "description": "Completed 5 quizzes"}]', '2025-03-07 15:30:58.87151+02', '2025-03-14 16:51:07.019723+02');
INSERT INTO public.user_stats VALUES (3, 40, 2, 4, '[]', '2025-03-17 15:07:42.429613+02', '2025-03-18 13:32:04.105242+02');


--
-- TOC entry 5113 (class 0 OID 16882)
-- Dependencies: 228
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (5, '{}', 'e.kinyua@alustudent.com', 'GOOGLE_AUTH', 'user', true, true, '2025-03-07 16:54:18.304769', '2025-03-07 16:54:18.216181', '2025-03-07 16:54:18.304769', '114969225431350522416', 'https://lh3.googleusercontent.com/a/ACg8ocIIUWyfjLkfN0ehLaKo8nITJ1mMh-vWxYpwriYNC6hpVrotmGU=s96-c');
INSERT INTO public.users VALUES (3, 'kenyua', 'kinyua0007@gmail.com', '$2b$10$Yadf/dEUq/zUQWaz2hlWAO0jmm7VAODshjB2HgU3fX3zDyOD/yGKK', 'user', true, false, '2025-03-22 11:01:23.964111', '2025-02-20 13:10:04.564812', '2025-03-22 11:01:23.964111', NULL, 'http://localhost:5000/uploads/profiles/profile-3-1742297314210-882729355.jpeg');
INSERT INTO public.users VALUES (4, 'postgres', 'vulgencepostgres@gmail.com', '$2b$10$uswf150Ls3vQdKmocsSnZOu/yjs9C3zrccHdu3CLhwNxr677iRxdi', 'admin', true, false, '2025-03-22 13:10:00.677011', '2025-02-21 13:44:59.918091', '2025-03-22 13:10:00.677011', '114625478163443473340', 'http://localhost:5000/uploads/profiles/profile-4-1742385790170-639534764.jpeg');


--
-- TOC entry 5118 (class 0 OID 16927)
-- Dependencies: 233
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 242
-- Name: cultural_content_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cultural_content_history_id_seq', 146, true);


--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 240
-- Name: cultural_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cultural_content_id_seq', 9, true);


--
-- TOC entry 5160 (class 0 OID 0)
-- Dependencies: 246
-- Name: cultural_content_votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cultural_content_votes_id_seq', 45, true);


--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 244
-- Name: debug_species_ids_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.debug_species_ids_id_seq', 5, true);


--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 230
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 250
-- Name: search_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.search_history_id_seq', 5, true);


--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 236
-- Name: species_facts_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.species_facts_history_id_seq', 1, false);


--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 234
-- Name: species_facts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.species_facts_id_seq', 1, false);


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 225
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.species_id_seq', 400, true);


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 248
-- Name: species_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.species_views_id_seq', 21, true);


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 223
-- Name: taxonomic_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taxonomic_keys_id_seq', 170, true);


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 232
-- Name: verification_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verification_tokens_id_seq', 1, false);


--
-- TOC entry 4917 (class 2606 OID 17217)
-- Name: cultural_content_history cultural_content_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_history
    ADD CONSTRAINT cultural_content_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4909 (class 2606 OID 17192)
-- Name: cultural_content cultural_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content
    ADD CONSTRAINT cultural_content_pkey PRIMARY KEY (id);


--
-- TOC entry 4921 (class 2606 OID 25320)
-- Name: cultural_content_votes cultural_content_votes_content_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_votes
    ADD CONSTRAINT cultural_content_votes_content_id_user_id_key UNIQUE (content_id, user_id);


--
-- TOC entry 4923 (class 2606 OID 25318)
-- Name: cultural_content_votes cultural_content_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_votes
    ADD CONSTRAINT cultural_content_votes_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 17242)
-- Name: debug_species_ids debug_species_ids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.debug_species_ids
    ADD CONSTRAINT debug_species_ids_pkey PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 16920)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 2606 OID 25384)
-- Name: search_history search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 17087)
-- Name: species_facts_history species_facts_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts_history
    ADD CONSTRAINT species_facts_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 17062)
-- Name: species_facts species_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts
    ADD CONSTRAINT species_facts_pkey PRIMARY KEY (id);


--
-- TOC entry 4879 (class 2606 OID 16799)
-- Name: species species_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_pkey PRIMARY KEY (composite_key);


--
-- TOC entry 4931 (class 2606 OID 25361)
-- Name: species_views species_views_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_views
    ADD CONSTRAINT species_views_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 16781)
-- Name: taxonomic_keys taxonomic_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxonomic_keys
    ADD CONSTRAINT taxonomic_keys_pkey PRIMARY KEY (id);


--
-- TOC entry 4874 (class 2606 OID 16783)
-- Name: taxonomic_keys taxonomic_keys_taxon_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxonomic_keys
    ADD CONSTRAINT taxonomic_keys_taxon_key_key UNIQUE (taxon_key);


--
-- TOC entry 4890 (class 2606 OID 16907)
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4907 (class 2606 OID 17170)
-- Name: user_stats user_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4884 (class 2606 OID 16898)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4886 (class 2606 OID 16894)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4888 (class 2606 OID 16896)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4897 (class 2606 OID 16933)
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 1259 OID 25332)
-- Name: idx_content_votes_content; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_votes_content ON public.cultural_content_votes USING btree (content_id);


--
-- TOC entry 4925 (class 1259 OID 25337)
-- Name: idx_content_votes_direction; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_votes_direction ON public.cultural_content_votes USING btree (content_id, user_id, vote_direction);


--
-- TOC entry 4926 (class 1259 OID 25331)
-- Name: idx_content_votes_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_votes_user ON public.cultural_content_votes USING btree (user_id);


--
-- TOC entry 4910 (class 1259 OID 17229)
-- Name: idx_cultural_content_author; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cultural_content_author ON public.cultural_content USING btree (author_id);


--
-- TOC entry 4911 (class 1259 OID 25348)
-- Name: idx_cultural_content_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cultural_content_deleted_at ON public.cultural_content USING btree (deleted_at);


--
-- TOC entry 4912 (class 1259 OID 17232)
-- Name: idx_cultural_content_language; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cultural_content_language ON public.cultural_content USING btree (language);


--
-- TOC entry 4913 (class 1259 OID 17228)
-- Name: idx_cultural_content_species; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cultural_content_species ON public.cultural_content USING btree (species_id);


--
-- TOC entry 4914 (class 1259 OID 17230)
-- Name: idx_cultural_content_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cultural_content_status ON public.cultural_content USING btree (status);


--
-- TOC entry 4915 (class 1259 OID 17231)
-- Name: idx_cultural_content_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cultural_content_type ON public.cultural_content USING btree (content_type);


--
-- TOC entry 4891 (class 1259 OID 16941)
-- Name: idx_password_reset_tokens_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_reset_tokens_user ON public.password_reset_tokens USING btree (user_id);


--
-- TOC entry 4932 (class 1259 OID 25391)
-- Name: idx_search_history_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_search_history_date ON public.search_history USING btree (searched_at);


--
-- TOC entry 4933 (class 1259 OID 25390)
-- Name: idx_search_history_query; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_search_history_query ON public.search_history USING btree (query_text);


--
-- TOC entry 4898 (class 1259 OID 17099)
-- Name: idx_species_facts_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_facts_category ON public.species_facts USING btree (category);


--
-- TOC entry 4899 (class 1259 OID 17100)
-- Name: idx_species_facts_creator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_facts_creator ON public.species_facts USING btree (created_by);


--
-- TOC entry 4900 (class 1259 OID 17098)
-- Name: idx_species_facts_species; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_facts_species ON public.species_facts USING btree (species_id);


--
-- TOC entry 4875 (class 1259 OID 16810)
-- Name: idx_species_gbif_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_gbif_key ON public.species USING btree (gbif_key);


--
-- TOC entry 4876 (class 1259 OID 16812)
-- Name: idx_species_kingdom_class; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_kingdom_class ON public.species USING btree (kingdom_key, class_key);


--
-- TOC entry 4877 (class 1259 OID 16811)
-- Name: idx_species_scientific_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_scientific_name ON public.species USING btree (scientific_name);


--
-- TOC entry 4927 (class 1259 OID 25374)
-- Name: idx_species_views_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_views_date ON public.species_views USING btree (viewed_at);


--
-- TOC entry 4928 (class 1259 OID 25372)
-- Name: idx_species_views_species; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_views_species ON public.species_views USING btree (species_id);


--
-- TOC entry 4929 (class 1259 OID 25373)
-- Name: idx_species_views_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_species_views_user ON public.species_views USING btree (user_id);


--
-- TOC entry 4869 (class 1259 OID 16813)
-- Name: idx_taxonomic_keys_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_taxonomic_keys_name ON public.taxonomic_keys USING btree (name);


--
-- TOC entry 4870 (class 1259 OID 16814)
-- Name: idx_taxonomic_keys_rank; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_taxonomic_keys_rank ON public.taxonomic_keys USING btree (rank);


--
-- TOC entry 4905 (class 1259 OID 17176)
-- Name: idx_user_stats_xp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_stats_xp ON public.user_stats USING btree (xp DESC);


--
-- TOC entry 4880 (class 1259 OID 16940)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4881 (class 1259 OID 17110)
-- Name: idx_users_google_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_google_id ON public.users USING btree (google_id);


--
-- TOC entry 4882 (class 1259 OID 16939)
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- TOC entry 4894 (class 1259 OID 16943)
-- Name: idx_verification_tokens_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_verification_tokens_token ON public.verification_tokens USING btree (token);


--
-- TOC entry 4895 (class 1259 OID 16942)
-- Name: idx_verification_tokens_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_verification_tokens_user ON public.verification_tokens USING btree (user_id);


--
-- TOC entry 4961 (class 2620 OID 17234)
-- Name: cultural_content log_cultural_content_changes_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER log_cultural_content_changes_trigger AFTER INSERT OR DELETE OR UPDATE ON public.cultural_content FOR EACH ROW EXECUTE FUNCTION public.log_cultural_content_changes();


--
-- TOC entry 4958 (class 2620 OID 17104)
-- Name: species_facts log_species_facts_changes_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER log_species_facts_changes_trigger AFTER INSERT OR DELETE OR UPDATE ON public.species_facts FOR EACH ROW EXECUTE FUNCTION public.log_species_facts_changes();


--
-- TOC entry 4962 (class 2620 OID 17233)
-- Name: cultural_content update_cultural_content_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_cultural_content_timestamp BEFORE UPDATE ON public.cultural_content FOR EACH ROW EXECUTE FUNCTION public.update_cultural_content_timestamp();


--
-- TOC entry 4959 (class 2620 OID 17102)
-- Name: species_facts update_species_facts_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_species_facts_timestamp BEFORE UPDATE ON public.species_facts FOR EACH ROW EXECUTE FUNCTION public.update_species_facts_timestamp();


--
-- TOC entry 4957 (class 2620 OID 16945)
-- Name: user_profiles update_user_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4960 (class 2620 OID 17178)
-- Name: user_stats update_user_stats_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_stats_timestamp BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_timestamp();


--
-- TOC entry 4956 (class 2620 OID 16944)
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4952 (class 2606 OID 25338)
-- Name: cultural_content_votes cultural_content_votes_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_votes
    ADD CONSTRAINT cultural_content_votes_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.cultural_content(id) ON DELETE CASCADE;


--
-- TOC entry 4953 (class 2606 OID 25326)
-- Name: cultural_content_votes cultural_content_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_votes
    ADD CONSTRAINT cultural_content_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4948 (class 2606 OID 17198)
-- Name: cultural_content fk_cultural_content_author; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content
    ADD CONSTRAINT fk_cultural_content_author FOREIGN KEY (author_id) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4950 (class 2606 OID 25343)
-- Name: cultural_content_history fk_cultural_content_history_content; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_history
    ADD CONSTRAINT fk_cultural_content_history_content FOREIGN KEY (content_id) REFERENCES public.cultural_content(id) ON DELETE SET NULL;


--
-- TOC entry 4951 (class 2606 OID 17223)
-- Name: cultural_content_history fk_cultural_content_history_modifier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content_history
    ADD CONSTRAINT fk_cultural_content_history_modifier FOREIGN KEY (modified_by) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4949 (class 2606 OID 17203)
-- Name: cultural_content fk_cultural_content_modifier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cultural_content
    ADD CONSTRAINT fk_cultural_content_modifier FOREIGN KEY (last_modified_by) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4940 (class 2606 OID 16921)
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4955 (class 2606 OID 25385)
-- Name: search_history search_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4937 (class 2606 OID 16805)
-- Name: species species_class_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_class_key_fkey FOREIGN KEY (class_key) REFERENCES public.taxonomic_keys(taxon_key);


--
-- TOC entry 4942 (class 2606 OID 17068)
-- Name: species_facts species_facts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts
    ADD CONSTRAINT species_facts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4945 (class 2606 OID 17088)
-- Name: species_facts_history species_facts_history_fact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts_history
    ADD CONSTRAINT species_facts_history_fact_id_fkey FOREIGN KEY (fact_id) REFERENCES public.species_facts(id);


--
-- TOC entry 4946 (class 2606 OID 17093)
-- Name: species_facts_history species_facts_history_modified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts_history
    ADD CONSTRAINT species_facts_history_modified_by_fkey FOREIGN KEY (modified_by) REFERENCES public.users(id);


--
-- TOC entry 4943 (class 2606 OID 17073)
-- Name: species_facts species_facts_last_modified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts
    ADD CONSTRAINT species_facts_last_modified_by_fkey FOREIGN KEY (last_modified_by) REFERENCES public.users(id);


--
-- TOC entry 4944 (class 2606 OID 17063)
-- Name: species_facts species_facts_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_facts
    ADD CONSTRAINT species_facts_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.species(composite_key);


--
-- TOC entry 4938 (class 2606 OID 16800)
-- Name: species species_kingdom_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_kingdom_key_fkey FOREIGN KEY (kingdom_key) REFERENCES public.taxonomic_keys(taxon_key);


--
-- TOC entry 4954 (class 2606 OID 25367)
-- Name: species_views species_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species_views
    ADD CONSTRAINT species_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4936 (class 2606 OID 16784)
-- Name: taxonomic_keys taxonomic_keys_parent_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxonomic_keys
    ADD CONSTRAINT taxonomic_keys_parent_key_fkey FOREIGN KEY (parent_key) REFERENCES public.taxonomic_keys(taxon_key);


--
-- TOC entry 4939 (class 2606 OID 16908)
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4947 (class 2606 OID 17171)
-- Name: user_stats user_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4941 (class 2606 OID 16934)
-- Name: verification_tokens verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-03-23 15:58:13

--
-- PostgreSQL database dump complete
--

