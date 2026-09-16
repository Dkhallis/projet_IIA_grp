create type public.user_role as enum ('etudiant', 'personnel', 'admin');
create type public.demande_statut as enum ('nouveau', 'en_cours', 'resolu', 'refuse');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text not null,
  email text not null unique,
  role public.user_role not null default 'etudiant',
  bloque boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique
);

create table public.lieux (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  batiment text
);

create table public.demandes (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  categorie_id uuid references public.categories(id) on delete set null,
  lieu_id uuid references public.lieux(id) on delete set null,
  auteur_id uuid not null references public.profiles(id) on delete cascade,
  statut public.demande_statut not null default 'nouveau',
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  demande_id uuid not null references public.demandes(id) on delete cascade,
  signale_par uuid not null references public.profiles(id) on delete cascade,
  motif text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_demandes_updated_at
before update on public.demandes
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.demandes enable row level security;
alter table public.reports enable row level security;

create policy "Les étudiants voient leurs propres demandes"
  on public.demandes for select
  using (auteur_id = auth.uid());

create policy "Le personnel et l'admin voient toutes les demandes"
  on public.demandes for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('personnel', 'admin')
    )
  );

insert into public.categories (nom) values
  ('Wi-Fi'), ('Matériel'), ('Salle'), ('Informatique');

insert into public.lieux (nom, batiment) values
  ('Salle 101', 'Bâtiment A'),
  ('Amphi B', 'Bâtiment B'),
  ('Bibliothèque', 'Bâtiment C');