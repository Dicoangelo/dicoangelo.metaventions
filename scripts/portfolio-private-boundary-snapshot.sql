-- Read-only definition snapshot; save output outside the repository before migration.
select jsonb_build_object(
  'captured_at', now(),
  'tables', (select jsonb_agg(jsonb_build_object('name', c.relname, 'rls',c.relrowsecurity,'force_rls',c.relforcerowsecurity,'acl',c.relacl)) from pg_class c join pg_namespace n on c.relnamespace=n.oid where n.nspname='public' and c.relname in ('career_dossier_sections','jd_analyses','contact_submissions')),
  'policies', (select jsonb_agg(to_jsonb(p)) from pg_policies p where schemaname='public' and tablename in ('career_dossier_sections','jd_analyses','contact_submissions')),
  'grants', (select jsonb_agg(to_jsonb(g)) from information_schema.role_table_grants g where table_schema='public' and table_name in ('career_dossier_sections','jd_analyses','contact_submissions')),
  'functions', (select jsonb_agg(jsonb_build_object('signature',p.oid::regprocedure::text,'definition',pg_get_functiondef(p.oid),'acl',p.proacl)) from pg_proc p join pg_namespace n on p.pronamespace=n.oid where n.nspname='public' and p.prokind = 'f' and p.prosrc ~ '(career_dossier_sections|jd_analyses|contact_submissions)')
) as portfolio_schema_snapshot;
