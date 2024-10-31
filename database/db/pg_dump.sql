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

CREATE DATABASE akcereg WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE akcereg OWNER TO postgres;

\connect akcereg

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

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.predmet (
    kod_predmetu text NOT NULL PRIMARY KEY,
    zkratka_predmetu text,
    katedra text,
    pocet_cviceni integer
);

CREATE TABLE public.student (
    id character(40) NOT NULL PRIMARY KEY,
    datum_vytvoreni timestamp without time zone NOT NULL
);

CREATE TABLE public.vyucujici (
    id character(40) NOT NULL PRIMARY KEY
);

CREATE TABLE public.termin (
    id uuid not null PRIMARY KEY,
    ucebna text,
    datum_start timestamp without time zone,
    aktualni_kapacita integer,
    max_kapacita integer,
    vypsal_id character(40) NOT NULL REFERENCES public.vyucujici(id) ON DELETE CASCADE,
    vyucuje_id character(40) NOT NULL REFERENCES public.vyucujici(id) ON DELETE CASCADE,
    kod_predmet text NOT NULL REFERENCES public.predmet(kod_predmetu) ON DELETE CASCADE ON UPDATE CASCADE,
    jmeno text,
    cislo_cviceni integer,
    datum_konec timestamp without time zone,
    popis text
);

CREATE TABLE public.vyucujici_predmety (
    vyucujici_id character varying(40) NOT NULL REFERENCES public.vyucujici(id) ON DELETE CASCADE,
    kod_predmetu text NOT NULL REFERENCES public.predmet(kod_predmetu) ON DELETE CASCADE ON UPDATE CASCADE,
    id bigserial NOT NULL PRIMARY KEY
);

CREATE TABLE public.historie_terminu (
    id uuid not null PRIMARY KEY,
    student_id character(40) NOT NULL REFERENCES public.student(id) ON DELETE CASCADE,
    termin_id uuid NOT NULL REFERENCES public.termin(id) ON DELETE CASCADE,
    datum_splneni timestamp without time zone
);

CREATE SEQUENCE public.vyucujici_predmety_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.vyucujici_predmety_id_seq OWNER TO postgres;
ALTER SEQUENCE public.vyucujici_predmety_id_seq OWNED BY public.vyucujici_predmety.id;
SELECT pg_catalog.setval('public.vyucujici_predmety_id_seq', 0, true);

ALTER TABLE public.predmet OWNER TO postgres;
ALTER TABLE public.student OWNER TO postgres;
ALTER TABLE public.termin OWNER TO postgres;
ALTER TABLE public.vyucujici OWNER TO postgres;
ALTER TABLE public.vyucujici_predmety OWNER TO postgres;
ALTER TABLE public.historie_terminu OWNER TO postgres;
ALTER TABLE ONLY public.vyucujici_predmety ALTER COLUMN id SET DEFAULT nextval('public.vyucujici_predmety_id_seq'::regclass);

