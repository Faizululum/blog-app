import { createMiddleware } from "@arcjet/next";
import { ajMiddleware } from "@/lib/arcjet";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import type { NextFetchEvent } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|healthz).*)"],
};

const arcjetMiddleware = createMiddleware(ajMiddleware);

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const arcjetResponse = await arcjetMiddleware(request, event);
  const response = NextResponse.next();

  // Protected routes
  const protectedRoutes = ["/"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname === route ||
    request.nextUrl.pathname.startsWith(route + "/")
  );

  if (isProtectedRoute) {
    const token = (await cookies()).get("token")?.value;
    const user = token ? await verifyAuth(token) : null;

    if (!user) {
      if (request.nextUrl.pathname !== "/login") {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Copy headers dari arcjet ke response Next.js
  if (arcjetResponse && arcjetResponse.headers) {
    arcjetResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
  }

  if (arcjetResponse && arcjetResponse.status !== 200) {
    return arcjetResponse;
  }

  return response;
}