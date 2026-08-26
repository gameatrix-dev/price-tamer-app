CREATE TABLE public.item_locks (
  item_name TEXT PRIMARY KEY,
  locked BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.item_locks TO anon;
GRANT SELECT ON public.item_locks TO authenticated;
GRANT ALL ON public.item_locks TO service_role;

ALTER TABLE public.item_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read item locks"
  ON public.item_locks FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.item_locks (item_name, locked) VALUES
  ('Poćwiartowane w kawałki mięso — wilk / jeleń / dzik (całość)', true),
  ('Poćwiartowane w kawałki mięso z niedźwiedzia (całość)', true);