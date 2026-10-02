-- Portfolio scope only. Historical material is retained for authenticated server-side review.
-- Before applying, save the output of scripts/portfolio-schema-snapshot.sql alongside
-- a checksummed scripts/portfolio-knowledge.py backup.
begin;
create table if not exists public.portfolio_knowledge (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  category text not null check (category in ('current-role','career','research','project','faq')),
  content text not null,
  summary text,
  source_refs text[] not null check (cardinality(source_refs) > 0),
  content_hash text not null check (content_hash = encode(sha256(convert_to(content, 'UTF8')), 'hex')),
  reviewed_at timestamptz not null,
  review_after timestamptz not null check (review_after > reviewed_at),
  visibility text not null default 'private' check (visibility in ('public','internal','private')),
  status text not null default 'pending' check (status in ('pending','reviewed','quarantined')),
  revision integer not null default 1 check (revision > 0),
  source_manifest jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_knowledge_review_log (
  id bigint generated always as identity primary key,
  slug text not null,
  previous_record jsonb,
  reviewed_record jsonb not null,
  recorded_at timestamptz not null default now()
);
create or replace function public.record_portfolio_knowledge_revision()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'UPDATE' then
    NEW.revision := OLD.revision + 1;
    NEW.updated_at := now();
    insert into public.portfolio_knowledge_review_log(slug, previous_record, reviewed_record)
    values (NEW.slug, to_jsonb(OLD), to_jsonb(NEW));
  else
    insert into public.portfolio_knowledge_review_log(slug, reviewed_record)
    values (NEW.slug, to_jsonb(NEW));
  end if;
  return NEW;
end $$;
drop trigger if exists portfolio_knowledge_revision on public.portfolio_knowledge;
create trigger portfolio_knowledge_revision before insert or update on public.portfolio_knowledge
for each row execute function public.record_portfolio_knowledge_revision();
alter table public.portfolio_knowledge enable row level security;
alter table public.portfolio_knowledge_review_log enable row level security;
revoke all on public.portfolio_knowledge, public.portfolio_knowledge_review_log from public, anon, authenticated;
grant select on public.portfolio_knowledge to anon, authenticated;
grant all on public.portfolio_knowledge, public.portfolio_knowledge_review_log to service_role;
grant usage, select on sequence public.portfolio_knowledge_review_log_id_seq to service_role;
drop policy if exists reviewed_public_knowledge on public.portfolio_knowledge;
create policy reviewed_public_knowledge on public.portfolio_knowledge for select to anon, authenticated
using (visibility = 'public' and status = 'reviewed' and reviewed_at <= now() and review_after > now());
revoke all on function public.record_portfolio_knowledge_revision() from public, anon, authenticated;
-- Retain historical rows/chunks and their policies; revoke anonymous direct access.
revoke all on public.artifacts, public.artifact_chunks, public.career_dossier_chunks from public, anon, authenticated;
grant all on public.artifacts, public.artifact_chunks, public.career_dossier_chunks to service_role;
revoke all on public.chat_logs, public.skill_gap_analytics from public, anon, authenticated;
grant insert on public.chat_logs to anon, authenticated;
grant all on public.chat_logs, public.skill_gap_analytics to service_role;
-- Definer RPCs can bypass table permissions, so close only portfolio legacy retrieval RPCs.
do $$ declare f record; begin
  for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on p.pronamespace=n.oid
    where n.nspname='public' and p.proname in ('match_artifact_chunks','match_dossier_chunks','search_career_dossier')
  loop execute format('revoke all on function %s from public, anon, authenticated', f.signature); end loop;
end $$;
notify pgrst, 'reload schema';
commit;
