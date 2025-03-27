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

-- Create custom types
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
CREATE TYPE content_type AS ENUM ('myth', 'legend', 'proverb');
CREATE TYPE content_status AS ENUM ('pending', 'approved', 'rejected', 'archived');
CREATE TYPE content_language AS ENUM ('en', 'rw', 'sw');