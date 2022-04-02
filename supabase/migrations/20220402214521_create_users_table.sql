CREATE TABLE public.users
(
    id              uuid          not null primary key default uuid_generate_v4(),
    username        varchar(50)   not null,
    first_name      varchar(100)  null,
    last_name       varchar(100)  null,
    profile_picture text          null,
    login_methods   varchar(50)[] not null             default array []::varchar(50)[]
);