import { NextRequest, NextResponse } from "next/server";

// Server-to-server backend URL (never exposed to the browser)
const BACKEND_INTERNAL_URL = (
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://127.0.0.1:8000"
).replace(/\/$/, "");

// Frappe site name used in X-Frappe-Site-Name header
const FRAPPE_SITE_NAME =
    process.env.FRAPPE_SITE_NAME ||
    process.env.NEXT_PUBLIC_FRAPPE_SITE_NAME;

async function handleProxy(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    const pathStr = Array.isArray(path) ? path.join("/") : path;
    const searchParams = req.nextUrl.search;

    const targetUrl = `${BACKEND_INTERNAL_URL}/api/method/${pathStr}${searchParams}`;

    // Resolve site name: env var → incoming Host header → localhost
    const incomingHost = req.headers.get("host")?.split(":")[0];
    const siteName = FRAPPE_SITE_NAME || incomingHost || "localhost";

    const headers: Record<string, string> = {
        "X-Frappe-Site-Name": siteName,
        "Accept": "application/json",
    };

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
        return new NextResponse(data, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("Content-Type") || "application/json",
            },
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
