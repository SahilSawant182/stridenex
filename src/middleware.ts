import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept users who are not permitted to access StrideNex hub
  const canAccessStridenex = request.cookies.get("can_access_stridenex")?.value;
  if (canAccessStridenex === "false") {
    const isDashboardRoute =
      pathname.startsWith("/industry") ||
      pathname.startsWith("/college") ||
      pathname.startsWith("/mentor") ||
      pathname.startsWith("/student");

    if (isDashboardRoute) {
      const isInstructor = request.cookies.get("isInstructor")?.value === "true";
      const redirectTarget = isInstructor ? "/lms/dashboard?view=instructor" : "/lms/courses";
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }
  }

  // Intercept direct browser navigation to LMS authoring routes
  const isLmsAuthoringRoute =
    pathname === "/lms/courses" ||
    pathname === "/courses" ||
    pathname === "/lms/course/create" ||
    pathname === "/course/create" ||
    pathname === "/lms/batch/create" ||
    pathname === "/batch/create" ||
    pathname === "/lms/quizzes" ||
    pathname === "/quizzes" ||
    pathname.startsWith("/lms/quizzes/") ||
    pathname.startsWith("/quizzes/") ||
    pathname === "/lms/sales-earnings" ||
    pathname === "/sales-earnings";

  if (isLmsAuthoringRoute) {
    const roleCookie = (request.cookies.get("user_role")?.value || "").toLowerCase();
    const lmsAccessCookie = request.cookies.get("has_lms_access")?.value;

    // Partner and Admin accounts always bypass all checks
    const isPartner = roleCookie.includes("partner");
    const isAdmin = roleCookie.includes("admin") || roleCookie.includes("administrator") || roleCookie.includes("system manager");

    if (isPartner || isAdmin) {
      return NextResponse.next();
    }

    const isRestrictedRole =
      roleCookie.includes("college") ||
      roleCookie.includes("industry") ||
      roleCookie.includes("mentor");

    // If restricted role without verified LMS access, redirect to dashboard/plans
    if (isRestrictedRole && lmsAccessCookie === "false") {
      let redirectTarget = "/mentor/dashboard/plans";
      if (roleCookie.includes("college")) {
        redirectTarget = "/college/dashboard/plans";
      } else if (roleCookie.includes("industry")) {
        redirectTarget = "/industry/dashboard/plans";
      } else if (roleCookie.includes("mentor")) {
        redirectTarget = "/mentor/dashboard/plans";
      }
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/industry/:path*",
    "/college/:path*",
    "/mentor/:path*",
    "/student/:path*",
    "/lms/courses",
    "/courses",
    "/lms/course/create",
    "/course/create",
    "/lms/batch/create",
    "/batch/create",
    "/lms/quizzes/:path*",
    "/quizzes/:path*",
    "/lms/sales-earnings",
    "/sales-earnings",
  ],
};
