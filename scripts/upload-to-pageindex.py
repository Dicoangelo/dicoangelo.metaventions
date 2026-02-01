#!/usr/bin/env python3
"""
Upload career dossier to PageIndex for reasoning-based RAG.

This script uploads the TECHNICAL_DOSSIER.md file to PageIndex and
returns the document ID needed for queries.

Usage:
    pip install pageindex
    python scripts/upload-to-pageindex.py

After upload, add PAGEINDEX_DOCUMENT_ID to your .env.local
"""

import os
import sys
import time

try:
    from pageindex import PageIndexClient
except ImportError:
    print("Installing pageindex package...")
    os.system("pip install pageindex")
    from pageindex import PageIndexClient

# Configuration
API_KEY = os.getenv("PAGEINDEX_API_KEY", "pi_4zcWlfZWdTXThTRhyRag3M")
DOSSIER_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "TECHNICAL_DOSSIER.md")

def main():
    print("=" * 60)
    print("PageIndex Dossier Upload")
    print("=" * 60)

    # Verify file exists
    if not os.path.exists(DOSSIER_PATH):
        print(f"❌ Dossier not found at: {DOSSIER_PATH}")
        sys.exit(1)

    print(f"📄 Found dossier: {DOSSIER_PATH}")

    # Get file size
    file_size = os.path.getsize(DOSSIER_PATH)
    print(f"📊 File size: {file_size / 1024:.1f} KB")

    # Initialize PageIndex client
    print("\n🔌 Connecting to PageIndex...")
    try:
        client = PageIndexClient(api_key=API_KEY)
        print("✅ Connected to PageIndex")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        sys.exit(1)

    # Upload document
    print("\n📤 Uploading dossier...")
    try:
        result = client.submit_document(DOSSIER_PATH)
        doc_id = result.get("doc_id") or result.get("id")
        print(f"✅ Upload initiated: {doc_id}")
    except Exception as e:
        print(f"❌ Upload failed: {e}")

        # Try alternative method - read file and upload content
        print("\n🔄 Trying alternative upload method...")
        try:
            with open(DOSSIER_PATH, 'r') as f:
                content = f.read()

            # Use files API if available
            result = client.upload_file(
                file_path=DOSSIER_PATH,
                file_name="TECHNICAL_DOSSIER.md"
            )
            doc_id = result.get("doc_id") or result.get("id")
            print(f"✅ Upload initiated: {doc_id}")
        except Exception as e2:
            print(f"❌ Alternative upload also failed: {e2}")
            print("\n💡 Try uploading manually at https://dash.pageindex.ai")
            sys.exit(1)

    # Poll for completion
    print("\n⏳ Waiting for processing...")
    max_attempts = 60  # 5 minutes max
    for i in range(max_attempts):
        try:
            status_response = client.get_document(doc_id)
            status = status_response.get("status", "unknown")

            if status == "completed":
                print(f"\n✅ Processing complete!")
                print(f"\n{'=' * 60}")
                print("📋 NEXT STEPS:")
                print(f"{'=' * 60}")
                print(f"\n1. Add this to your .env.local:")
                print(f"   PAGEINDEX_DOCUMENT_ID={doc_id}")
                print(f"\n2. Add to Vercel environment variables:")
                print(f"   vercel env add PAGEINDEX_DOCUMENT_ID")
                print(f"   (paste: {doc_id})")
                print(f"\n3. Redeploy to activate PageIndex RAG")
                return
            elif status == "failed":
                print(f"\n❌ Processing failed")
                print(f"Response: {status_response}")
                sys.exit(1)
            else:
                print(f"   Status: {status} ({i+1}/{max_attempts})", end='\r')
                time.sleep(5)
        except Exception as e:
            print(f"   Error checking status: {e}")
            time.sleep(5)

    print("\n⚠️ Timeout waiting for processing. Check status at https://dash.pageindex.ai")
    print(f"Document ID: {doc_id}")

if __name__ == "__main__":
    main()
