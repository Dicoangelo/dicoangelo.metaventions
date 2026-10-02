import { NextResponse } from "next/server";
import { isAdminRequest, adminUnauthorizedResponse } from "@/lib/admin-auth";

/** Historical artifacts cannot be promoted into the reviewed public collection. */
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return adminUnauthorizedResponse();
  return NextResponse.json({
    error: "Public publishing requires the reviewed portfolio knowledge workflow. Historical artifacts remain private.",
  }, { status: 409, headers: { "Cache-Control": "private, no-store" } });
}
