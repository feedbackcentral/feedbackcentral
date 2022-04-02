CREATE TABLE public.users
(
    id              uuid          not null primary key default uuid_generate_v4(),
    username        varchar(50)   not null,
    first_name      varchar(100)  null,
    last_name       varchar(100)  null,
    profile_picture text          null,
    login_methods   varchar(50)[] not null             default array []::varchar(50)[]
);

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
    classification public.feedback_classification null
);

-- TODO add a join to project and only select data where the project consents to being involved in training
CREATE VIEW public.feedback_ai_view AS
SELECT content, classification
FROM public.feedback;

-- TODO Foreign Keys