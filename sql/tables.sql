CREATE TABLE public.users
(
    id              uuid          not null primary key references auth.users (id),
    username        varchar(50)   not null,
    first_name      varchar(100)  null,
    last_name       varchar(100)  null,
    profile_picture text          null,
    login_methods   varchar(50)[] not null default array []::varchar(50)[]
);

CREATE TABLE public.integrations
(
    id                   uuid        not null primary key default uuid_generate_v4(),
    name                 varchar(50) not null,
    icon                 text        null,
    features             bigint         not null             default 0,
    public_key           text        not null             default 'public-key', -- So this can be not null have a default pair here, this will never be used.
    keypair_generated_at timestamptz null                                       -- Will remain null until the keypair is regenerated by the postgres function so it can be shown only once before being stored hashed.
);

CREATE TYPE public.project_tier AS ENUM ('free', 'pro');
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
    flags                  bigint                  not null             default 0
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