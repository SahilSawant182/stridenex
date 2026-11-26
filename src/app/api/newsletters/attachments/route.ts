import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, "")
    : "") ||
  "https://devstridenex.quantcloud.in"
).replace(/\/$/, "");

const backendOrigin = new URL(BACKEND_URL).origin;
const frappeSiteName =
  process.env.FRAPPE_SITE_NAME ||
  process.env.NEXT_PUBLIC_FRAPPE_SITE_NAME ||
  new URL(BACKEND_URL).hostname;

function attachmentHeaders(filename: string, contentType: string) {
  const safeFilename = filename.replace(/[\r\n"\\]/g, "_").slice(0, 180);
  const fallbackFilename = safeFilename.replace(/[^\x20-\x7E]/g, "_");

  return new Headers({
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const filename = request.nextUrl.searchParams.get("filename") || "newsletter-attachment";

  if (!path?.startsWith("/files/")) {
    return NextResponse.json({ error: "Invalid newsletter attachment path" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(path, BACKEND_URL);
  } catch {
    return NextResponse.json({ error: "Invalid newsletter attachment path" }, { status: 400 });
  }

  if (target.origin !== backendOrigin || !target.pathname.startsWith("/files/")) {
    return NextResponse.json({ error: "Invalid newsletter attachment path" }, { status: 400 });
  }

  try {
    const upstream = await fetch(target, {
      cache: "no-store",
      redirect: "manual",
      headers: {
        Accept: "*/*",
        Host: frappeSiteName,
        "X-Frappe-Site-Name": frappeSiteName,
      },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: `Unable to fetch attachment (${upstream.status})` },
        { status: upstream.status || 502 },
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: attachmentHeaders(
        filename,
        upstream.headers.get("content-type") || "application/octet-stream",
      ),
    });
  } catch {
    return NextResponse.json(
      { error: "Newsletter attachment download failed" },
      { status: 502 },
    );
  }
}
