CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_settings TO anon;
GRANT SELECT ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app settings"
ON public.app_settings
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.app_settings (key, value) VALUES
  ('announcement', '{"enabled": false, "status": "open", "text": "Skup czynny — zapraszamy!"}'::jsonb);