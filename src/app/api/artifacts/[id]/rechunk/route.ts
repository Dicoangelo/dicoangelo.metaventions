import { isAdminRequest, adminUnauthorizedResponse } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

/** Historical chunks preserve source evidence and cannot be replaced through this API. */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return adminUnauthorizedResponse();
  return NextResponse.json({
    error: "Historical chunks are preserved. Re-ingest reviewed entries through the portfolio knowledge workflow.",
  }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
}
