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

-- Create function for updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP; 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for species facts timestamp
CREATE OR REPLACE FUNCTION public.update_species_facts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP; 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for user stats timestamp
CREATE OR REPLACE FUNCTION public.update_user_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP; 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for cultural content timestamp
CREATE OR REPLACE FUNCTION public.update_cultural_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP; 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to log species facts changes
CREATE OR REPLACE FUNCTION public.log_species_facts_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.species_facts_history (
            fact_id, modified_by, modification_type, 
            old_content, new_content, 
            old_category, new_category
        ) VALUES (
            NEW.id, NEW.created_by, 'create',
            NULL, NEW.fact,
            NULL, NEW.category
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.fact <> NEW.fact OR OLD.category <> NEW.category) THEN
            INSERT INTO public.species_facts_history (
                fact_id, modified_by, modification_type, 
                old_content, new_content, 
                old_category, new_category
            ) VALUES (
                NEW.id, NEW.last_modified_by, 'update',
                OLD.fact, NEW.fact,
                OLD.category, NEW.category
            );
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.species_facts_history (
            fact_id, modified_by, modification_type, 
            old_content, new_content, 
            old_category, new_category
        ) VALUES (
            OLD.id, NULL, 'delete',
            OLD.fact, NULL,
            OLD.category, NULL
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create function to log cultural content changes
CREATE OR REPLACE FUNCTION public.log_cultural_content_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.cultural_content_history (
            content_id, modified_by, modification_type, 
            old_status, new_status, 
            old_content, new_content
        ) VALUES (
            NEW.id, NEW.author_id, 'create',
            NULL, NEW.status,
            NULL, NEW.content
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.content <> NEW.content OR OLD.status <> NEW.status) THEN
            INSERT INTO public.cultural_content_history (
                content_id, modified_by, modification_type, 
                old_status, new_status, 
                old_content, new_content
            ) VALUES (
                NEW.id, NEW.last_modified_by, 
                CASE 
                    WHEN OLD.status <> NEW.status THEN 'status_change'
                    ELSE 'update'
                END,
                OLD.status, NEW.status,
                OLD.content, NEW.content
            );
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.cultural_content_history (
            content_id, modified_by, modification_type, 
            old_status, new_status, 
            old_content, new_content
        ) VALUES (
            OLD.id, OLD.last_modified_by, 'delete',
            OLD.status, NULL,
            OLD.content, NULL
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Add foreign key constraints
ALTER TABLE public.taxonomic_keys 
ADD CONSTRAINT taxonomic_keys_parent_key_fkey 
FOREIGN KEY (parent_key) REFERENCES public.taxonomic_keys(taxon_key);

ALTER TABLE public.species 
ADD CONSTRAINT species_kingdom_key_fkey 
FOREIGN KEY (kingdom_key) REFERENCES public.taxonomic_keys(taxon_key);

ALTER TABLE public.species 
ADD CONSTRAINT species_class_key_fkey 
FOREIGN KEY (class_key) REFERENCES public.taxonomic_keys(taxon_key);

ALTER TABLE public.users 
ADD CONSTRAINT users_pkey 
PRIMARY KEY (id);

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.password_reset_tokens 
ADD CONSTRAINT password_reset_tokens_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.verification_tokens 
ADD CONSTRAINT verification_tokens_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.species_facts 
ADD CONSTRAINT species_facts_species_id_fkey 
FOREIGN KEY (species_id) REFERENCES public.species(composite_key);

ALTER TABLE public.species_facts 
ADD CONSTRAINT species_facts_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.users(id);

ALTER TABLE public.species_facts 
ADD CONSTRAINT species_facts_last_modified_by_fkey 
FOREIGN KEY (last_modified_by) REFERENCES public.users(id);

ALTER TABLE public.species_facts_history 
ADD CONSTRAINT species_facts_history_fact_id_fkey 
FOREIGN KEY (fact_id) REFERENCES public.species_facts(id);

ALTER TABLE public.species_facts_history 
ADD CONSTRAINT species_facts_history_modified_by_fkey 
FOREIGN KEY (modified_by) REFERENCES public.users(id);

ALTER TABLE public.user_stats 
ADD CONSTRAINT user_stats_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.cultural_content 
ADD CONSTRAINT fk_cultural_content_species 
FOREIGN KEY (species_id) REFERENCES public.species(composite_key);

ALTER TABLE public.cultural_content 
ADD CONSTRAINT fk_cultural_content_author 
FOREIGN KEY (author_id) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.cultural_content 
ADD CONSTRAINT fk_cultural_content_modifier 
FOREIGN KEY (last_modified_by) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.cultural_content_history 
ADD CONSTRAINT fk_cultural_content_history_content 
FOREIGN KEY (content_id) REFERENCES public.cultural_content(id) ON DELETE SET NULL;

ALTER TABLE public.cultural_content_history 
ADD CONSTRAINT fk_cultural_content_history_modifier 
FOREIGN KEY (modified_by) REFERENCES public.users(id) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.cultural_content_votes 
ADD CONSTRAINT cultural_content_votes_content_id_fkey 
FOREIGN KEY (content_id) REFERENCES public.cultural_content(id) ON DELETE CASCADE;

ALTER TABLE public.cultural_content_votes 
ADD CONSTRAINT cultural_content_votes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.species_views 
ADD CONSTRAINT species_views_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.search_history 
ADD CONSTRAINT search_history_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id);

-- Create indexes
CREATE INDEX idx_taxonomic_keys_name ON public.taxonomic_keys USING btree (name);
CREATE INDEX idx_taxonomic_keys_rank ON public.taxonomic_keys USING btree (rank);

CREATE INDEX idx_species_gbif_key ON public.species USING btree (gbif_key);
CREATE INDEX idx_species_scientific_name ON public.species USING btree (scientific_name);
CREATE INDEX idx_species_kingdom_class ON public.species USING btree (kingdom_key, class_key);

CREATE INDEX idx_users_username ON public.users USING btree (username);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_google_id ON public.users USING btree (google_id);

CREATE INDEX idx_verification_tokens_user ON public.verification_tokens USING btree (user_id);
CREATE INDEX idx_verification_tokens_token ON public.verification_tokens USING btree (token);

CREATE INDEX idx_password_reset_tokens_user ON public.password_reset_tokens USING btree (user_id);

CREATE INDEX idx_species_facts_species ON public.species_facts USING btree (species_id);
CREATE INDEX idx_species_facts_category ON public.species_facts USING btree (category);
CREATE INDEX idx_species_facts_creator ON public.species_facts USING btree (created_by);

CREATE INDEX idx_user_stats_xp ON public.user_stats USING btree (xp DESC);

CREATE INDEX idx_cultural_content_species ON public.cultural_content USING btree (species_id);
CREATE INDEX idx_cultural_content_author ON public.cultural_content USING btree (author_id);
CREATE INDEX idx_cultural_content_status ON public.cultural_content USING btree (status);
CREATE INDEX idx_cultural_content_type ON public.cultural_content USING btree (content_type);
CREATE INDEX idx_cultural_content_language ON public.cultural_content USING btree (language);
CREATE INDEX idx_cultural_content_deleted_at ON public.cultural_content USING btree (deleted_at);

CREATE INDEX idx_content_votes_content ON public.cultural_content_votes USING btree (content_id);
CREATE INDEX idx_content_votes_user ON public.cultural_content_votes USING btree (user_id);
CREATE INDEX idx_content_votes_direction ON public.cultural_content_votes USING btree (content_id, user_id, vote_direction);

CREATE INDEX idx_species_views_species ON public.species_views USING btree (species_id);
CREATE INDEX idx_species_views_user ON public.species_views USING btree (user_id);
CREATE INDEX idx_species_views_date ON public.species_views USING btree (viewed_at);

CREATE INDEX idx_search_history_query ON public.search_history USING btree (query_text);
CREATE INDEX idx_search_history_date ON public.search_history USING btree (searched_at);

-- Create triggers
CREATE TRIGGER update_species_facts_timestamp
BEFORE UPDATE ON public.species_facts
FOR EACH ROW EXECUTE FUNCTION public.update_species_facts_timestamp();

CREATE TRIGGER log_species_facts_changes_trigger
AFTER INSERT OR DELETE OR UPDATE ON public.species_facts
FOR EACH ROW EXECUTE FUNCTION public.log_species_facts_changes();

CREATE TRIGGER update_cultural_content_timestamp
BEFORE UPDATE ON public.cultural_content
FOR EACH ROW EXECUTE FUNCTION public.update_cultural_content_timestamp();

CREATE TRIGGER log_cultural_content_changes_trigger
AFTER INSERT OR DELETE OR UPDATE ON public.cultural_content
FOR EACH ROW EXECUTE FUNCTION public.log_cultural_content_changes();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_timestamp
BEFORE UPDATE ON public.user_stats
FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_timestamp();