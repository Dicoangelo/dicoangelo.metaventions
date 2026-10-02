"""Offline tests: safe plans, compare-and-swap and rollback refuse concurrent writes."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("knowledge", Path(__file__).parents[1] / "portfolio-knowledge.py")
knowledge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(knowledge)

class FakeDatabase:
    def __init__(self, rows=None, response=None):
        self.current = rows or []
        self.response = response if response is not None else []
        self.calls = []
    def rows(self, *_args, **_kwargs): return self.current
    def request(self, *args, **kwargs):
        self.calls.append((args, kwargs))
        return self.response

class KnowledgeTests(unittest.TestCase):
    def test_compare_and_swap_requires_matching_revision(self):
        db = FakeDatabase()
        with self.assertRaisesRegex(ValueError, "Concurrent reviewed edit"):
            knowledge.compare_and_swap(db, "current-role-ezra", 4, {"status": "reviewed"})
        self.assertIn("revision=eq.4", db.calls[0][0][0])
        self.assertEqual(db.calls[0][0][1], "PATCH")
    def test_compare_and_swap_returns_written_revision(self):
        db = FakeDatabase(response=[{"slug": "role", "revision": 5}])
        self.assertEqual(knowledge.compare_and_swap(db, "role", 4, {})["revision"], 5)
    def test_record_signature_normalizes_database_timestamp_format(self):
        a = {"slug": "role", "reviewed_at": "2026-10-01", "review_after": "2026-12-30"}
        b = {**a, "reviewed_at": "2026-10-01T00:00:00+00:00", "review_after": "2026-12-30T00:00:00+00:00"}
        self.assertEqual(knowledge.record_signature(a), knowledge.record_signature(b))
        self.assertNotEqual(knowledge.record_signature(a), knowledge.record_signature({**b, "title": "Changed"}))
    def test_rollback_refuses_newer_revision_before_any_mutation(self):
        old = {"slug": "role", "revision": 1}
        db = FakeDatabase(rows=[{**old, "revision": 2}])
        receipt = {"backup": "/unused", "before_artifacts": [], "before_knowledge": [old], "created_slugs": [],
                   "after_knowledge": {"role": {"signature": knowledge.record_signature(old), "revision": 1}}}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "receipt.json"; knowledge.private_json(path, receipt)
            with patch.object(knowledge, "validate_backup", return_value=Path(directory)):
                with self.assertRaisesRegex(ValueError, "changed after apply"):
                    knowledge.rollback(db, path, str(Path(directory) / "rollback.json"))
        self.assertEqual(db.calls, [])
    def test_rollback_quarantines_new_rows_without_deleting(self):
        row = {"slug": "new-role", "revision": 1}
        db = FakeDatabase(rows=[row], response=[{**row, "revision": 2}])
        receipt = {"backup": "/unused", "before_artifacts": [], "before_knowledge": [], "created_slugs": [row["slug"]],
                   "after_knowledge": {row["slug"]: {"signature": knowledge.record_signature(row), "revision": 1}}}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "receipt.json"; knowledge.private_json(path, receipt)
            with patch.object(knowledge, "validate_backup", return_value=Path(directory)):
                knowledge.rollback(db, path, str(Path(directory) / "rollback.json"))
        self.assertEqual(db.calls[0][0][1], "PATCH")
        self.assertEqual(db.calls[0][0][2], {"status": "quarantined", "visibility": "private"})
        self.assertIn("revision=eq.1", db.calls[0][0][0])

if __name__ == "__main__": unittest.main()
