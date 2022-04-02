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