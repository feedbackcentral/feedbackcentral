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