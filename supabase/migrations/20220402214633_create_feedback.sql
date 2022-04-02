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