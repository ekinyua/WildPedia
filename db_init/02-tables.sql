-- Set up the database context
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Connect to the database
\connect biodiversity_db

-- Set search path
SET search_path TO public;
SELECT pg_catalog.set_config('search_path', 'public', false);

SET default_tablespace = '';
SET default_table_access_method = heap;

-- Create tables

-- Taxonomic keys table
CREATE SEQUENCE public.taxonomic_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.taxonomic_keys (
    id integer NOT NULL DEFAULT nextval('public.taxonomic_keys_id_seq'::regclass),
    name character varying(255) NOT NULL,
    rank character varying(50) NOT NULL,
    taxon_key integer NOT NULL,
    parent_key integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Species table
CREATE SEQUENCE public.species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.species (
    id integer NOT NULL DEFAULT nextval('public.species_id_seq'::regclass),
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
    location text,
    PRIMARY KEY (composite_key)
);

-- Users table
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.users (
    id integer NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
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
    profile_image_url text,
    PRIMARY KEY (id),
    UNIQUE (username),
    UNIQUE (email)
);

-- User profiles table
CREATE TABLE public.user_profiles (
    user_id integer NOT NULL,
    full_name character varying(100),
    bio text,
    location character varying(100),
    organization character varying(100),
    expertise_area character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- Password reset tokens table
CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass),
    user_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Verification tokens table
CREATE SEQUENCE public.verification_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.verification_tokens (
    id integer NOT NULL DEFAULT nextval('public.verification_tokens_id_seq'::regclass),
    user_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Species facts table
CREATE SEQUENCE public.species_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.species_facts (
    id integer NOT NULL DEFAULT nextval('public.species_facts_id_seq'::regclass),
    species_id character varying(255),
    category public.fact_category NOT NULL,
    fact text NOT NULL,
    source_reference text,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified_by integer,
    CONSTRAINT valid_fact CHECK ((length(fact) >= 10)),
    PRIMARY KEY (id)
);

-- Species facts history table
CREATE SEQUENCE public.species_facts_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.species_facts_history (
    id integer NOT NULL DEFAULT nextval('public.species_facts_history_id_seq'::regclass),
    fact_id integer,
    modified_by integer,
    modification_type character varying(20) NOT NULL,
    old_content text,
    new_content text,
    old_category public.fact_category,
    new_category public.fact_category,
    modified_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reason text,
    PRIMARY KEY (id)
);

-- User stats table
CREATE TABLE public.user_stats (
    user_id integer NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    quizzes_completed integer DEFAULT 0 NOT NULL,
    correct_answers integer DEFAULT 0 NOT NULL,
    badges jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- Cultural content table
CREATE SEQUENCE public.cultural_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.cultural_content (
    id integer NOT NULL DEFAULT nextval('public.cultural_content_id_seq'::regclass),
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
    CONSTRAINT valid_content CHECK ((length(content) >= 10)),
    PRIMARY KEY (id)
);

-- Cultural content history table
CREATE SEQUENCE public.cultural_content_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.cultural_content_history (
    id integer NOT NULL DEFAULT nextval('public.cultural_content_history_id_seq'::regclass),
    content_id integer,
    modified_by integer,
    modification_type character varying(20) NOT NULL,
    old_status public.content_status,
    new_status public.content_status,
    old_content text,
    new_content text,
    modified_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    reason text,
    content_id_reference integer,
    PRIMARY KEY (id)
);

-- Debug species ids table
CREATE SEQUENCE public.debug_species_ids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.debug_species_ids (
    id integer NOT NULL DEFAULT nextval('public.debug_species_ids_id_seq'::regclass),
    submitted_id character varying(255),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Cultural content votes table
CREATE SEQUENCE public.cultural_content_votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.cultural_content_votes (
    id integer NOT NULL DEFAULT nextval('public.cultural_content_votes_id_seq'::regclass),
    content_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    vote_direction character varying(4) DEFAULT 'up'::character varying NOT NULL,
    CONSTRAINT cultural_content_votes_vote_direction_check CHECK (((vote_direction)::text = ANY ((ARRAY['up'::character varying, 'down'::character varying])::text[]))),
    PRIMARY KEY (id),
    UNIQUE (content_id, user_id)
);

-- Species views table
CREATE SEQUENCE public.species_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.species_views (
    id integer NOT NULL DEFAULT nextval('public.species_views_id_seq'::regclass),
    species_id character varying(255),
    user_id integer,
    session_id character varying(255),
    ip_address character varying(45),
    viewed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Search history table
CREATE SEQUENCE public.search_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.search_history (
    id integer NOT NULL DEFAULT nextval('public.search_history_id_seq'::regclass),
    query_text character varying(255) NOT NULL,
    user_id integer,
    session_id character varying(255),
    ip_address character varying(45),
    result_count integer,
    searched_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Comments on tables
COMMENT ON TABLE public.species_facts IS 'Stores verified scientific facts about species';
COMMENT ON TABLE public.species_facts_history IS 'Tracks all modifications to species facts for auditing';
COMMENT ON TABLE public.user_stats IS 'Stores user XP, quiz completion statistics, and badges';