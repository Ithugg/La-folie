import { NextRequest, NextResponse } from "next/server";
import { validateTicket } from "@/actions/admin";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const result = await validateTicket(token);
  return NextResponse.json(result);
}
