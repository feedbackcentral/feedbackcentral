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
    SET public_key           = keypair.public,
        keypair_generated_at = now()
    WHERE id = integration_id;
    RETURN (true, '-', keypair.secret)::public.regen_keypair;
END
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- User insert trigger
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