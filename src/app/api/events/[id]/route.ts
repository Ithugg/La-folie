import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try finding by slug first, then by ID
  let event = await db.event.findUnique({
    where: { slug: id },
    include: {
      ticketTiers: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!event) {
    event = await db.event.findUnique({
      where: { id },
      include: {
        ticketTiers: { orderBy: { sortOrder: "asc" } },
      },
    });
  }

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}
