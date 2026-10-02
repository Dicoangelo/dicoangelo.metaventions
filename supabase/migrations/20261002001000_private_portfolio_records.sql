-- Apply only after backing up these three tables and their existing ACL/policy definitions.
-- Public contact/JD endpoints already perform their writes server-side.
begin;
revoke all on public.career_dossier_sections, public.jd_analyses, public.contact_submissions from public, anon, authenticated;
grant all on public.career_dossier_sections, public.jd_analyses, public.contact_submissions to service_role;
notify pgrst, 'reload schema';
commit;
