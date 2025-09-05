import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

// export default createMiddleware(routing);

export async function middleware(request: NextRequest) {

    const defaultLocale = request.headers.get('x-your-custom-locale') || 'en';
 
    // Step 2: Create and call the next-intl middleware (example)
    const handleI18nRouting = createMiddleware({
        locales: ['en', 'gr'],
        defaultLocale: 'en'
    });
    const response = handleI18nRouting(request);
 
    // Step 3: Alter the response (example)
    response.headers.set('x-your-custom-locale', defaultLocale);

    const currentUrlDashobard = request.url.includes("dashboard")
    
    const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.

    if (!sessionCookie && currentUrlDashobard) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // return NextResponse.next({
    //     request: {
    //     // Apply new request headers
    //         headers: requestHeaders,
    //     }
    // });

    return response;
}

export const config = {
    matcher: ["/dashboard", '/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};