CREATE TABLE public.integrations
(
    id   uuid        not null primary key default uuid_generate_v4(),
    name varchar(50) not null,
    icon text        null
    -- TODO Add the other important data e.g. ingest info
);