import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isAuthed(req: NextRequest): boolean {
  const access = req.cookies.get("accessToken")?.value;
  const refresh = req.cookies.get("refreshToken")?.value;
  return Boolean(access || refresh);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = isAuthed(req);
  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname.includes("/dashboard/") ||
    pathname === "/profile" ||
    pathname.includes("/profile/");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isProtectedRoute && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (isAuthPage && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
