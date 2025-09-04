import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export async function middleware(request: NextRequest) {

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);

    const currentUrlDashobard = request.url.includes("dashboard")
    
    const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.

    if (!sessionCookie && currentUrlDashobard) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next({
        request: {
        // Apply new request headers
            headers: requestHeaders,
        }
    });
}

export const config = {
    matcher: ["/dashboard", '/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};