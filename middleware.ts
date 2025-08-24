import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard"],
};