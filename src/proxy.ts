import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - always accessible
  const publicRoutes = ["/", "/about", "/account"];
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/calendar");
  const isApiRoute = pathname.startsWith("/api/");

  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  // All other routes just pass through - auth is handled in layouts
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
