-- Read-only definition snapshot; save output outside the repository before migration.
select jsonb_build_object(
  'captured_at', now(),
  'tables', (select jsonb_agg(jsonb_build_object('name', c.relname, 'rls',c.relrowsecurity,'force_rls',c.relforcerowsecurity,'acl',c.relacl)) from pg_class c join pg_namespace n on c.relnamespace=n.oid where n.nspname='public' and c.relname in ('artifacts','artifact_chunks','career_dossier_chunks','chat_logs','skill_gap_analytics','portfolio_knowledge','portfolio_knowledge_review_log')),
  'policies', (select jsonb_agg(to_jsonb(p)) from pg_policies p where schemaname='public' and tablename in ('artifacts','artifact_chunks','career_dossier_chunks','chat_logs','skill_gap_analytics','portfolio_knowledge','portfolio_knowledge_review_log')),
  'grants', (select jsonb_agg(to_jsonb(g)) from information_schema.role_table_grants g where table_schema='public' and table_name in ('artifacts','artifact_chunks','career_dossier_chunks','chat_logs','skill_gap_analytics','portfolio_knowledge','portfolio_knowledge_review_log')),
  'functions', (select jsonb_agg(jsonb_build_object('signature',p.oid::regprocedure::text,'definition',pg_get_functiondef(p.oid),'acl',p.proacl)) from pg_proc p join pg_namespace n on p.pronamespace=n.oid where n.nspname='public' and p.proname in ('match_artifact_chunks','match_dossier_chunks','search_career_dossier','record_portfolio_knowledge_revision'))
) as portfolio_schema_snapshot;
