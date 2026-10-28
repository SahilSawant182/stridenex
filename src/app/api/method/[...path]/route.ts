import { NextRequest, NextResponse } from "next/server";

// Server-to-server backend URL (never exposed to the browser)
const BACKEND_INTERNAL_URL = (
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, "") : "") ||
    "https://devstridenex.quantcloud.in"
).replace(/\/$/, "");

// Frappe site name used in X-Frappe-Site-Name header
const DEFAULT_SITE_NAME = (() => {
    try {
        return new URL(BACKEND_INTERNAL_URL).hostname;
    } catch {
        return "devstridenex.quantcloud.in";
    }
})();

const FRAPPE_SITE_NAME =
    process.env.FRAPPE_SITE_NAME ||
    process.env.NEXT_PUBLIC_FRAPPE_SITE_NAME ||
    DEFAULT_SITE_NAME;

async function handleProxy(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    const pathStr = Array.isArray(path) ? path.join("/") : path;
    const searchParams = req.nextUrl.search;

    const targetUrl = `${BACKEND_INTERNAL_URL}/api/method/${pathStr}${searchParams}`;

    // Resolve site name: avoid sending 'localhost' to multi-tenant Frappe backend
    const incomingHost = req.headers.get("host")?.split(":")[0];
    const isLocal = !incomingHost || incomingHost === "localhost" || incomingHost === "127.0.0.1";
    const siteName = FRAPPE_SITE_NAME || (!isLocal ? incomingHost : DEFAULT_SITE_NAME);

    const headers: Record<string, string> = {
        "X-Frappe-Site-Name": siteName,
        "Accept": "application/json",
    };

    try {
        headers["Host"] = new URL(targetUrl).host;
    } catch {
        headers["Host"] = siteName;
    }

    const contentType = req.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;

    const cookie = req.headers.get("cookie");
    if (cookie) headers["Cookie"] = cookie;

    const authorization = req.headers.get("authorization");
    if (authorization) headers["Authorization"] = authorization;

    try {
        const bodyText =
            req.method !== "GET" && req.method !== "HEAD"
                ? await req.text()
                : undefined;

        const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: bodyText,
            cache: "no-store",
        });

        const data = await response.text();
        const resHeaders = new Headers();
        resHeaders.set(
            "Content-Type",
            response.headers.get("Content-Type") || "application/json"
        );

        // Forward Set-Cookie headers from Frappe backend back to browser
        // Remove 'Domain' attribute so cookies are accepted by localhost
        const getSetCookie = (response.headers as any).getSetCookie;
        const rawCookies: string[] = typeof getSetCookie === "function"
            ? getSetCookie.call(response.headers)
            : [response.headers.get("set-cookie")].filter(Boolean) as string[];

        for (const rawCookie of rawCookies) {
            const rewritten = rawCookie
                .replace(/Domain=[^;]+;?\s*/gi, "")
                .replace(/Secure;?\s*/gi, "");
            resHeaders.append("Set-Cookie", rewritten);
        }

        return new NextResponse(data, {
            status: response.status,
            headers: resHeaders,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Proxy request failed", details: String(error) },
            { status: 500 }
        );
    }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
