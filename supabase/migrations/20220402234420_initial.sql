CREATE TABLE public.users
(
    id              uuid          not null primary key default uuid_generate_v4(),
    username        varchar(50)   not null,
    first_name      varchar(100)  null,
    last_name       varchar(100)  null,
    profile_picture text          null,
    login_methods   varchar(50)[] not null             default array []::varchar(50)[]
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
    id   uuid        not null primary key default uuid_generate_v4(),
    name varchar(50) not null,
    icon text        null
    -- TODO Add the other important data e.g. ingest info
);

CREATE TYPE public.project_tier AS ENUM ('free');

CREATE TABLE public.projects
(
    id                   uuid                not null primary key default uuid_generate_v4(),
    name                 varchar(50)         not null,
    owner_id             uuid                not null,
    enabled_integrations uuid[]              not null             default array []::uuid[],
    team                 uuid[]              not null             default array []::uuid[],
    tier                 public.project_tier not null             default 'free',
    -- TODO Add stripe info
    flags                int                 not null             default 0
);

CREATE TYPE public.feedback_classification AS ENUM ('positive', 'negative');

CREATE TABLE public.feedback
(
    id             uuid                           not null primary key default uuid_generate_v4(),
    -- TODO add project ID
    content        text                           not null             default '',
    source         uuid                           not null, -- Integration ID
    source_meta    jsonb                          not null             default '{}'::jsonb,
    classification public.feedback_classification null,
    classification_completion_id text null
);

-- TODO Foreign Keys