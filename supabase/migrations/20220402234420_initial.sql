CREATE EXTENSION IF NOT EXISTS PGCRYPTO SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS PGSODIUM SCHEMA extensions;

CREATE TABLE public.users
(
    id              uuid          not null primary key references auth.users (id),
    username        varchar(50)   not null,
    first_name      varchar(100)  null,
    last_name       varchar(100)  null,
    profile_picture text          null,
    login_methods   varchar(50)[] not null default array []::varchar(50)[]
);

CREATE OR REPLACE FUNCTION
    public.users_insert_trigger_fnc()
    RETURNS TRIGGER AS
$$
BEGIN
    -- TODO Review once UI for auth is working
    if NEW.email IS NOT NULL then
        INSERT INTO public.users (id, username, login_methods)
        VALUES (NEW.id,
                NEW.email,
                ARRAY ['magic']);
        RETURN NEW;
    else
        INSERT INTO public.users (id, username, login_methods)
        VALUES (NEW.id,
                NEW.raw_user_meta_data ->> 'user_name',
                ARRAY ['twitter']);
        RETURN NEW;
    end if;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS users_insert_trigger on auth.users;

CREATE TRIGGER
    users_insert_trigger
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
EXECUTE PROCEDURE
    public.users_insert_trigger_fnc(); 

CREATE TABLE public.integrations
(
    id                   uuid        not null primary key default uuid_generate_v4(),
    name                 varchar(50) not null,
    icon                 text        null,
    features             int         not null             default 0,
    public_key           text        not null             default 'public-key', -- So this can be not null have a default pair here, this will never be used.
    keypair_generated_at timestamptz null                                       -- Will remain null until the keypair is regenerated by the postgres function so it can be shown only once before being stored hashed.
);

CREATE TYPE public.regen_keypair AS
(
    success       boolean,
    error_message text,
    private_key   bytea
);

CREATE OR REPLACE FUNCTION public.regen_integration_keypair(integration_id uuid) RETURNS public.regen_keypair AS
$$
DECLARE
    integration public.integrations;
    keypair     crypto_sign_keypair;
BEGIN
    SELECT * INTO integration FROM public.integrations WHERE id = integration_id;
    IF integration IS NULL THEN
        RETURN (false, 'Invalid integration ID', 'private-key')::public.regen_keypair;
    END IF;
    SELECT * INTO keypair FROM crypto_sign_new_keypair();
    UPDATE public.integrations
    SET public_key           = '0x' + encode(keypair.public, 'hex'),
        keypair_generated_at = now()
    WHERE id = integration_id;
    RETURN (true, '-', '0x' + encode(keypair.secret, 'hex'))::public.regen_keypair;
END
$$ LANGUAGE plpgsql SECURITY INVOKER;

GRANT EXECUTE ON FUNCTION crypto_sign_new_keypair() TO authenticated;
GRANT EXECUTE ON FUNCTION crypto_sign_new_keypair() TO postgres;

CREATE TYPE public.project_tier AS ENUM ('free', 'paid');
CREATE TYPE public.stripe_status AS ENUM ('active', 'canceled', 'unpaid', 'past_due', 'trialing', 'incomplete', 'incomplete_expired');

CREATE TABLE public.projects
(
    id                     uuid                 not null primary key default uuid_generate_v4(),
    name                   varchar(50)          not null,
    owner_id               uuid                 not null references public.users (id),
    enabled_integrations   uuid[]               not null             default array []::uuid[],
    team                   uuid[]               not null             default array []::uuid[],
    tier                   public.project_tier  not null             default 'free',
    stripe_customer_id     text                 null, -- TODO auto generate on creation and make this not null
    stripe_subscription_id text                 null, -- TODO auto generate on creation and make this not null
    stripe_status          public.stripe_status null, -- TODO auto generate on creation and make this not null
    flags                  int                  not null             default 0
);

CREATE TYPE public.feedback_classification AS ENUM ('positive', 'negative', 'neutral');

CREATE TABLE public.feedback
(
    id             uuid                           not null primary key default uuid_generate_v4(),
    project_id     uuid                           not null references public.projects (id),
    content        text                           not null             default '',
    source         uuid                           not null references public.integrations (id), -- Integration ID
    source_meta    jsonb                          not null             default '{}'::jsonb,
    classification public.feedback_classification null
);