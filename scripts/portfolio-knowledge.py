#!/usr/bin/env python3
"""Portfolio-only knowledge inventory, protected backup and reviewed-data maintenance.

Reads credentials from --env-file without logging values. Default commands are read-only.
Backups contain private data: keep them outside the repository, mode 0700/0600.
"""
import argparse
import collections
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import subprocess
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

TABLES = ("artifacts", "artifact_chunks", "career_dossier_chunks", "chat_logs", "skill_gap_analytics", "career_dossier_sections", "jd_analyses", "contact_submissions")


def digest(value):
    return hashlib.sha256(value.encode() if isinstance(value, str) else value).hexdigest()


def stamp():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def private_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as out:
        json.dump(value, out, ensure_ascii=False, indent=2)
        out.write("\n")
    os.chmod(path, 0o600)


class Database:
    def __init__(self, env_file):
        env = {}
        for line in Path(env_file).read_text().splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                key, value = line.split("=", 1)
                env[key.strip()] = value.strip().strip('"').strip("'")
        self.base = env["SUPABASE_URL"].rstrip("/") + "/rest/v1/"
        self.key = env["SUPABASE_SERVICE_ROLE_KEY"]
        self.public_key = env["SUPABASE_KEY"]

    def request(self, path, method="GET", body=None, public=False, prefer=None):
        key = self.public_key if public else self.key
        headers = {"apikey": key, "Authorization": "Bearer " + key}
        if prefer:
            headers["Prefer"] = prefer
        if body is not None:
            headers["Content-Type"] = "application/json"
        req = Request(self.base + path, headers=headers, method=method,
                      data=None if body is None else json.dumps(body).encode())
        try:
            with urlopen(req, timeout=20) as response:
                raw = response.read()
                return json.loads(raw) if raw else None
        except HTTPError as error:
            # Never print request headers or raw private response data.
            raise RuntimeError(f"Database {method} {path.split('?')[0]} returned HTTP {error.code}") from None

    def rows(self, table, select="*", filters=None, public=False):
        result, offset = [], 0
        while True:
            query = {"select": select, "order": "slug" if table == "portfolio_knowledge" else "id", "limit": 500, "offset": offset, **(filters or {})}
            batch = self.request(table + "?" + urlencode(query), public=public)
            result.extend(batch)
            if len(batch) < 500:
                return result
            offset += 500


def audit(db):
    artifacts = db.rows("artifacts")
    chunks = db.rows("artifact_chunks", "id,artifact_id,content,embedding,chunk_index")
    legacy = db.rows("career_dossier_chunks", "id,section_id,content,embedding,chunk_index")
    chunk_counts = collections.Counter(row["artifact_id"] for row in chunks)
    all_hashes = collections.defaultdict(list)
    for table, rows in (("artifact_chunks", chunks), ("career_dossier_chunks", legacy)):
        for row in rows:
            h = digest(re.sub(r"\s+", " ", row["content"]).strip())
            all_hashes[h].append({"table": table, "id": row["id"]})
    catalog_file = Path(__file__).resolve().parents[1] / "data/artifact-catalog.json"
    catalog = json.loads(catalog_file.read_text()) if catalog_file.exists() else []
    catalog_slugs = {row["slug"] for row in catalog}
    patterns = {
        "private_application_profile": r"APPLICATION AUTOFILL PROFILE|\"eeo\"|\"legal_name|\bEEO defaults\b",
        "withdrawn_career_metrics": r"900[Kk]|900,000|50\+\s*(?:reports|dashboards)|30%\s*(?:faster|onboard)|222,750|7,425",
        "accepted_paper": r"Burstiness Was Measured Wrong|LP4FM|1E20ig92Zi",
        "current_role": r"Revenue Technology Manager|EZRA",
    }
    entries = []
    for row in artifacts:
        text = row["content"] + " " + (row.get("summary") or "")
        entries.append({"id": row["id"], "slug": row["slug"], "status": row["status"],
                        "updated_at": row["updated_at"], "content_hash": digest(row["content"]),
                        "characters": len(row["content"]), "chunks": chunk_counts[row["id"]],
                        "sensitivity": [tag for tag in row.get("tags", []) if tag.startswith("sens:")],
                        "cataloged": row["slug"] in catalog_slugs,
                        "review_signals": [name for name, pattern in patterns.items() if re.search(pattern, text, re.I)]})
    try:
        reviewed = db.rows("portfolio_knowledge")
    except RuntimeError:
        reviewed = []
    reviewed_inventory = [{"slug": row["slug"], "category": row["category"], "status": row["status"],
        "visibility": row["visibility"], "reviewed_at": row["reviewed_at"], "review_after": row["review_after"],
        "content_hash_valid": digest(row["content"]) == row["content_hash"], "source_count": len(row["source_refs"]),
        "revision": row["revision"]} for row in reviewed]
    return {"generated_at": stamp(), "reviewed_public_inventory": reviewed_inventory,
            "review_backlog": {"historical_unreviewed": len(artifacts), "legacy_unreviewed_chunks": len(legacy),
                "sensitivity_counts": dict(collections.Counter(tag for r in artifacts for tag in r.get("tags", []) if tag.startswith("sens:"))),
                "conflict_signal_counts": dict(collections.Counter(flag for entry in entries for flag in entry["review_signals"]))},
            "counts": {"artifacts": len(artifacts), "artifact_chunks": len(chunks),
             "legacy_chunks": len(legacy), "reviewed_entries": len(reviewed), "without_chunks": sum(not chunk_counts[r["id"]] for r in artifacts),
             "uncataloged": sum(r["slug"] not in catalog_slugs for r in artifacts),
             "null_embeddings": sum(r.get("embedding") is None for r in chunks + legacy)},
            "status_counts": dict(collections.Counter(r["status"] for r in artifacts)),
            "duplicate_chunk_groups": [v for v in all_hashes.values() if len(v) > 1], "artifacts": entries}


def backup(db, directory):
    directory = Path(directory).resolve()
    repo = Path(__file__).resolve().parents[1]
    if directory == repo or repo in directory.parents:
        raise ValueError("Private backups must be outside the repository")
    directory.mkdir(parents=True, exist_ok=False, mode=0o700)
    os.chmod(directory, 0o700)
    manifest = {"created_at": stamp(), "scope": list(TABLES), "files": {},
                "schema_limit": "PostgREST OpenAPI captured; SQL policies/RPC definitions require authorized management SQL access"}
    for table in (*TABLES, "portfolio_knowledge", "portfolio_knowledge_review_log"):
        try:
            rows = db.rows(table)
        except RuntimeError:
            if table in TABLES:
                raise
            continue
        path = directory / (table + ".json")
        private_json(path, rows)
        manifest["files"][path.name] = {"rows": len(rows), "sha256": digest(path.read_bytes())}
    path = directory / "postgrest-schema.json"
    private_json(path, db.request(""))
    manifest["files"][path.name] = {"sha256": digest(path.read_bytes())}
    private_json(directory / "manifest.json", manifest)
    return {"backup_directory": str(directory), "counts": {name: info.get("rows") for name, info in manifest["files"].items()},
            "manifest_sha256": digest((directory / "manifest.json").read_bytes())}



def validate_backup(directory):
    directory = Path(directory).resolve()
    manifest = json.loads((directory / "manifest.json").read_text())
    for filename, record in manifest["files"].items():
        if digest((directory / filename).read_bytes()) != record["sha256"]:
            raise ValueError("Backup checksum mismatch: " + filename)
    if not all(table + ".json" in manifest["files"] for table in TABLES):
        raise ValueError("Incomplete portfolio backup")
    return directory


def reviewed_pack():
    repo = Path(__file__).resolve().parents[1]
    process = subprocess.run([str(repo / "node_modules/.bin/tsx"), str(repo / "scripts/export-public-knowledge.ts")],
                             cwd=repo, capture_output=True, text=True, timeout=15, check=True)
    rows = json.loads(process.stdout)
    slugs = set()
    now = dt.datetime.now(dt.timezone.utc)
    for row in rows:
        slug = row["slug"]
        if slug in slugs or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            raise ValueError("Duplicate or invalid reviewed slug")
        slugs.add(slug)
        reviewed = dt.datetime.fromisoformat(row["reviewed_at"]).replace(tzinfo=dt.timezone.utc)
        expires = dt.datetime.fromisoformat(row["review_after"]).replace(tzinfo=dt.timezone.utc)
        if not reviewed <= now < expires or row["visibility"] != "public" or row["status"] != "reviewed":
            raise ValueError("Unreviewed or expired publication entry: " + slug)
        if not row["source_refs"] or not any(ref.startswith("https://") for ref in row["source_refs"]):
            raise ValueError("Public source link missing: " + slug)
        if re.search(r'APPLICATION AUTOFILL PROFILE|"(?:eeo|legal_name|street_address)"', row["content"], re.I):
            raise ValueError("Private profile content blocked: " + slug)
        row["content_hash"] = digest(row["content"])
        row.setdefault("summary", None)
        row["source_manifest"] = {"kind": "reviewed-repository-allowlist", "path": "src/content/knowledge/public-knowledge.ts",
                                  "record_hash": digest(json.dumps(row, sort_keys=True, ensure_ascii=False))}
    return rows


def record_signature(row):
    # Normalize DB timestamp spelling (midnight UTC versus date-only) for idempotent plans.
    fields = {key: row.get(key) for key in ("slug", "title", "category", "content", "summary", "source_refs",
              "content_hash", "reviewed_at", "review_after", "visibility", "status", "source_manifest")}
    for key in ("reviewed_at", "review_after"):
        fields[key] = str(fields[key])[:10]
    return digest(json.dumps(fields, sort_keys=True, ensure_ascii=False))


def make_plan(db):
    pack = reviewed_pack()
    historical = db.rows("artifacts")
    current = db.rows("portfolio_knowledge")  # Schema must be installed; never silently target a legacy table.
    by_slug = {row["slug"]: row for row in current}
    upserts = [row["slug"] for row in pack if row["slug"] not in by_slug or record_signature(row) != record_signature(by_slug[row["slug"]])]
    retired = [row["slug"] for row in current if row["slug"] not in {entry["slug"] for entry in pack} and row["status"] != "quarantined"]
    quarantine = [row["id"] for row in historical if row["status"] != "archived" or row.get("metrics", {}).get("knowledge_review_status") != "quarantined"]
    return {"generated_at": stamp(), "counts": {"reviewed_pack": len(pack), "upserts": len(upserts), "quarantine_legacy": len(quarantine), "retired_public": len(retired)},
            "pack_hash": digest(json.dumps(pack, sort_keys=True, ensure_ascii=False)),
            "upsert_slugs": upserts, "retired_slugs": retired, "quarantine_ids": quarantine,
            "basis": {"historical": {r["id"]: {"hash": digest(r["content"]), "status": r["status"], "updated_at": r["updated_at"]} for r in historical},
                      "reviewed": {r["slug"]: {"signature": record_signature(r), "revision": r["revision"]} for r in current}}}


def compare_and_swap(db, slug, revision, changes):
    result = db.request("portfolio_knowledge?" + urlencode({"slug": "eq." + slug, "revision": "eq." + str(revision)}),
                        "PATCH", changes, prefer="return=representation")
    if len(result or []) != 1:
        raise ValueError("Concurrent reviewed edit; stopped safely, consult receipt")
    return result[0]


def apply_plan(db, plan_path, backup_path, output):
    backup_dir = validate_backup(backup_path)
    expected = json.loads(Path(plan_path).read_text())
    actual = make_plan(db)
    if any(expected[key] != actual[key] for key in ("pack_hash", "upsert_slugs", "retired_slugs", "quarantine_ids", "basis")):
        raise ValueError("Plan is stale; inspect and generate a fresh plan")
    historical = {r["id"]: r for r in db.rows("artifacts")}
    current = db.rows("portfolio_knowledge")
    # Full immediately-before records are protected in the durable receipt, in addition to the full initial backup.
    receipt = {"started_at": stamp(), "backup": str(backup_dir), "plan_sha256": digest(Path(plan_path).read_bytes()),
               "before_artifacts": [historical[key] for key in actual["quarantine_ids"]],
               "before_knowledge": [r for r in current if r["slug"] in actual["upsert_slugs"] + actual["retired_slugs"]],
               "after_knowledge": {}, "after_artifacts": {},
               "created_slugs": [s for s in actual["upsert_slugs"] if s not in {r["slug"] for r in current}], "completed": []}
    private_json(Path(output), receipt)
    for key in actual["quarantine_ids"]:
        row = historical[key]
        flags = []
        if any(tag in ("sens:private", "sens:internal") for tag in row.get("tags", [])): flags.append("restricted-source-label")
        if re.search(r'APPLICATION AUTOFILL PROFILE|"(?:eeo|legal_name)"', row["content"], re.I): flags.append("private-profile")
        flags.append("not-in-reviewed-public-allowlist")
        metrics = {**row.get("metrics", {}), "knowledge_review_status": "quarantined", "knowledge_previous_status": row["status"],
                   "knowledge_reason": "; ".join(flags), "knowledge_quarantined_at": stamp(), "knowledge_source_hash": digest(row["content"]),
                   "knowledge_backup": backup_dir.name}
        result = db.request("artifacts?" + urlencode({"id": "eq." + key, "updated_at": "eq." + row["updated_at"]}), "PATCH",
                            {"status": "archived", "metrics": metrics}, prefer="return=representation")
        if len(result or []) != 1: raise ValueError("Concurrent historical edit; stopped safely, consult receipt")
        receipt["after_artifacts"][key] = {k: result[0][k] for k in ("status", "metrics", "updated_at")}
        receipt["completed"].append({"action": "quarantine", "id": key})
        private_json(Path(output), receipt)
    for slug in actual["retired_slugs"]:
        prior = next(row for row in current if row["slug"] == slug)
        result = compare_and_swap(db, slug, prior["revision"], {"status": "quarantined", "visibility": "private"})
        receipt["after_knowledge"][slug] = {"signature": record_signature(result), "revision": result["revision"]}
        receipt["completed"].append({"action": "retire", "slug": slug})
        private_json(Path(output), receipt)
    for row in reviewed_pack():
        if row["slug"] not in actual["upsert_slugs"]: continue
        prior = next((entry for entry in current if entry["slug"] == row["slug"]), None)
        if prior:
            result = compare_and_swap(db, row["slug"], prior["revision"], row)
        else:
            # No conflict merge: a concurrent new slug must stop rather than overwrite.
            inserted = db.request("portfolio_knowledge", "POST", row, prefer="return=representation")
            if len(inserted or []) != 1: raise ValueError("Insert did not return exactly one reviewed record")
            result = inserted[0]
        receipt["after_knowledge"][row["slug"]] = {"signature": record_signature(result), "revision": result["revision"]}
        receipt["completed"].append({"action": "upsert", "slug": row["slug"]})
        private_json(Path(output), receipt)
    receipt["completed_at"] = stamp()
    receipt["after_plan"] = make_plan(db)
    private_json(Path(output), receipt)
    return {"receipt": output, "completed_actions": len(receipt["completed"]), "remaining_changes": receipt["after_plan"]["counts"]}


def rollback(db, receipt_path, output):
    receipt = json.loads(Path(receipt_path).read_text())
    validate_backup(receipt["backup"])
    # Restore metadata/data only. Never reopen public legacy grants or delete newly introduced records.
    restored = []
    after_basis = receipt.get("after_knowledge") or receipt.get("after_plan", {}).get("basis", {}).get("reviewed", {})
    present = {row["slug"]: row for row in db.rows("portfolio_knowledge")}
    affected = {row["slug"] for row in receipt["before_knowledge"]} | set(receipt["created_slugs"])
    for slug in affected:
        expected = after_basis.get(slug)
        if not expected or slug not in present or record_signature(present[slug]) != expected["signature"] or present[slug]["revision"] != expected["revision"]:
            raise ValueError("Reviewed records changed after apply; manual review required before rollback")
    for row in receipt["before_artifacts"]:
        current = db.rows("artifacts", filters={"id": "eq." + row["id"]})
        if not current or digest(current[0]["content"]) != digest(row["content"]):
            raise ValueError("Historical content changed after apply; manual review required")
        expected = receipt.get("after_artifacts", {}).get(row["id"])
        if expected and any(current[0][key] != expected[key] for key in ("status", "metrics", "updated_at")):
            raise ValueError("Historical metadata changed after apply; manual review required")
        result = db.request("artifacts?" + urlencode({"id": "eq." + row["id"], "updated_at": "eq." + current[0]["updated_at"], "metrics": "eq." + json.dumps(current[0]["metrics"], separators=(",", ":"))}),
                            "PATCH", {"status": row["status"], "metrics": row["metrics"]}, prefer="return=representation")
        if len(result or []) != 1: raise ValueError("Concurrent historical edit during rollback")
        restored.append(row["id"])
    for row in receipt["before_knowledge"]:
        restore = {key: value for key, value in row.items() if key not in ("revision", "created_at", "updated_at")}
        compare_and_swap(db, row["slug"], after_basis[row["slug"]]["revision"], restore)
    for slug in receipt["created_slugs"]:
        compare_and_swap(db, slug, after_basis[slug]["revision"], {"status": "quarantined", "visibility": "private"})
    result = {"rolled_back_at": stamp(), "restored_legacy_metadata": len(restored), "new_records_quarantined": len(receipt["created_slugs"]), "public_legacy_access": "remains closed"}
    private_json(Path(output), result)
    return result


def verify(db, backup_path):
    directory = validate_backup(backup_path)
    report = {"verified_at": stamp(), "counts": {}, "preservation": {}, "anonymous_access": {}}
    for table in TABLES:
        current = db.rows(table)
        before = json.loads((directory / (table + ".json")).read_text())
        report["counts"][table] = len(current)
        report["preservation"][table + "_original_ids_retained"] = {r["id"] for r in before} <= {r["id"] for r in current}
        if table in ("artifact_chunks", "career_dossier_chunks"):
            report["preservation"][table + "_unchanged"] = before == current
        if table == "artifacts":
            by_id = {r["id"]: r for r in current}
            report["preservation"]["artifact_contents_unchanged"] = all(r["content"] == by_id.get(r["id"], {}).get("content") for r in before)
            report["counts"]["archived_artifacts"] = sum(r["status"] == "archived" for r in current)
        try:
            public = db.request(table + "?select=id&limit=1", public=True)
            report["anonymous_access"][table] = {"denied": False, "readable_rows": len(public)}
        except RuntimeError as error:
            report["anonymous_access"][table] = {"denied": "HTTP 401" in str(error) or "HTTP 403" in str(error)}
    # Read-only probes of legacy definer RPCs. A denied execution is expected.
    for name in ("match_artifact_chunks", "match_dossier_chunks", "search_career_dossier"):
        try:
            result = db.request("rpc/" + name, "POST", {"query_embedding": json.dumps([0.01] * 1024), "match_threshold": 0.1, "match_count": 1}, public=True)
            report["anonymous_access"][name] = {"denied": False, "readable_rows": len(result or [])}
        except RuntimeError as error:
            report["anonymous_access"][name] = {"denied": any(code in str(error) for code in ("HTTP 401", "HTTP 403", "HTTP 404"))}
    public = db.rows("portfolio_knowledge", public=True)
    approved = {row["slug"]: row for row in reviewed_pack()}
    report["counts"]["anonymous_reviewed_entries"] = len(public)
    report["preservation"]["reviewed_public_matches_pack"] = len(public) == len(approved) and all(row["slug"] in approved and record_signature(row) == record_signature(approved[row["slug"]]) for row in public)
    report["passed"] = all(report["preservation"].values()) and all(value["denied"] for value in report["anonymous_access"].values())
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["audit", "backup", "plan", "apply", "rollback", "verify"])
    parser.add_argument("--env-file", required=True)
    parser.add_argument("--output", required=True, help="Protected output file; new directory for backup")
    parser.add_argument("--backup", help="Validated protected full snapshot, required for apply")
    parser.add_argument("--plan", help="Previously reviewed plan JSON, required for apply")
    parser.add_argument("--receipt", help="Apply receipt JSON, required for rollback")
    args = parser.parse_args()
    db = Database(args.env_file)
    if args.command == "backup": result = backup(db, args.output)
    elif args.command == "verify":
        if not args.backup: parser.error("verify requires --backup")
        report = verify(db, args.backup)
        private_json(Path(args.output), report)
        result = {"report": args.output, "passed": report["passed"], "counts": report["counts"]}
        if not report["passed"]:
            print(json.dumps(result, indent=2))
            sys.exit(1)
    elif args.command == "apply":
        if not args.backup or not args.plan: parser.error("apply requires --backup and --plan")
        result = apply_plan(db, args.plan, args.backup, args.output)
    elif args.command == "rollback":
        if not args.receipt: parser.error("rollback requires --receipt")
        result = rollback(db, args.receipt, args.output)
    elif args.command == "plan":
        report = make_plan(db)
        private_json(Path(args.output), report)
        result = {"plan": args.output, "counts": report["counts"], "pack_hash": report["pack_hash"]}
    else:
        report = audit(db)
        private_json(Path(args.output), report)
        result = {"report": args.output, "counts": report["counts"], "status_counts": report["status_counts"],
                  "duplicate_chunk_groups": len(report["duplicate_chunk_groups"])}
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    try: main()
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
