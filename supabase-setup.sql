-- ============================================================
-- Script à exécuter dans : Supabase → SQL Editor → New query
-- ============================================================

-- Table des produits
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(10, 2) default 0,
  category    text,
  description text,
  image       text,
  in_stock    boolean default true,
  featured    boolean default false,
  created_at  timestamptz default now()
);

-- Activer la lecture publique (la vitrine est publique)
alter table public.products enable row level security;

create policy "Lecture publique"
  on public.products for select
  using (true);

create policy "Écriture pour tous (à sécuriser plus tard)"
  on public.products for all
  using (true)
  with check (true);

-- Activer les mises à jour en temps réel
alter publication supabase_realtime add table public.products;
