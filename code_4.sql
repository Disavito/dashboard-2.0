-- Create the cuentas table
CREATE TABLE public.cuentas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert initial accounts
INSERT INTO public.cuentas (name) VALUES
('Efectivo'),
('Cuenta Fidel'),
('BBVA Empresa')
ON CONFLICT (name) DO NOTHING; -- Prevents errors if already exists

-- RLS for cuentas (example, adjust as needed for your project's security)
ALTER TABLE public.cuentas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.cuentas
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.cuentas
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON public.cuentas
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON public.cuentas
  FOR DELETE USING (auth.uid() IS NOT NULL);
