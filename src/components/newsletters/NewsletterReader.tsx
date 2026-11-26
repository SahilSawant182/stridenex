"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Eye,
  FileText,
} from "lucide-react";
import NewsletterSubscribeForm from "@/components/newsletters/NewsletterSubscribeForm";
import {
  fetchNewsletterDetail,
  formatNewsletterDate,
  getNewsletterAttachmentUrl,
  getNewsletterAssetUrl,
  NEWSLETTER_ORIGIN,
  type NewsletterDetail,
} from "@/lib/newsletters";

const allowedTags = new Set([
  "A", "B", "BLOCKQUOTE", "BR", "CAPTION", "CODE", "DD", "DIV", "DL",
  "DT", "EM", "FIGCAPTION", "FIGURE", "H1", "H2", "H3", "H4", "H5",
  "H6", "HR", "I", "IMG", "LI", "OL", "P", "PRE", "S", "SPAN", "STRONG",
  "SUB", "SUP", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "U", "UL",
]);
const allowedAttributes = new Set([
  "alt", "class", "colspan", "height", "href", "rel", "rowspan", "src", "style",
  "target", "title", "width",
]);
const allowedInlineStyles = [
  "background-color",
  "color",
  "font-size",
  "font-style",
  "font-weight",
  "letter-spacing",
  "line-height",
  "text-align",
  "text-decoration",
  "vertical-align",
];

function isSafeContentUrl(value: string) {
  const trimmed = value.trim();
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    /^(https?:|mailto:|tel:)/i.test(trimmed)
  );
}

function sanitizeInlineStyle(value: string, document: Document) {
  const styleElement = document.createElement("span");
  styleElement.setAttribute("style", value);

  return allowedInlineStyles
    .flatMap((property) => {
      const styleValue = styleElement.style.getPropertyValue(property).trim();
      if (
        !styleValue ||
        /url\s*\(|expression|javascript:|vbscript:|@import/i.test(styleValue)
      ) {
        return [];
      }
      return [`${property}: ${styleValue}`];
    })
    .join("; ");
}

function normalizeImageUrl(value: string | null | undefined) {
  const url = getNewsletterAssetUrl(value);
  if (!url) return "";

  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

function sanitizeNewsletterHtml(html: string, coverImage?: string | null) {
  if (typeof window === "undefined" || !html) return "";

  const document = new DOMParser().parseFromString(html, "text/html");
  const coverUrl = normalizeImageUrl(coverImage);
  document
    .querySelectorAll("script, style, iframe, object, embed, form, input, button, svg, math, link, meta")
    .forEach((element) => element.remove());

  Array.from(document.body.querySelectorAll("*")).forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    if (
      element.tagName === "IMG" &&
      coverUrl &&
      normalizeImageUrl(element.getAttribute("src")) === coverUrl
    ) {
      element.remove();
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (!allowedAttributes.has(name)) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (name === "style") {
        const safeStyle = sanitizeInlineStyle(attribute.value, document);
        if (safeStyle) element.setAttribute("style", safeStyle);
        else element.removeAttribute("style");
        return;
      }

      if ((name === "href" || name === "src") && !isSafeContentUrl(attribute.value)) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (name === "src") {
        const assetUrl = getNewsletterAssetUrl(attribute.value);
        if (assetUrl) element.setAttribute("src", assetUrl);
        else element.removeAttribute("src");
      }

      if (name === "target" && attribute.value === "_blank") {
        element.setAttribute("rel", "noopener noreferrer");
      }
    });

    if (element.tagName === "IMG") {
      element.setAttribute("loading", "lazy");
      element.setAttribute("class", "max-w-full h-auto rounded-xl");
    }
  });

  return document.body.innerHTML;
}

function buildEmailDocument(html: string) {
  if (typeof window === "undefined" || !html) return "";

  const document = new DOMParser().parseFromString(html, "text/html");
  document
    .querySelectorAll("script, iframe, object, embed, form, input, button, svg, math")
    .forEach((element) => element.remove());
  document.querySelectorAll("base").forEach((element) => element.remove());
  document.querySelectorAll('meta[http-equiv="refresh" i]').forEach((element) => element.remove());

  document.querySelectorAll("style").forEach((style) => {
    style.textContent = (style.textContent || "")
      .replace(/@import[^;]+;?/gi, "")
      .replace(/expression\s*\([^)]*\)/gi, "")
      .replace(/url\(\s*(['"]?)\s*(javascript|vbscript):[^)]*\)/gi, "none");
  });

  Array.from(document.querySelectorAll("*")).forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();

      if (
        name.startsWith("on") ||
        name === "srcdoc" ||
        name === "srcset" ||
        ((name === "href" || name === "src" || name === "xlink:href") &&
          /^(javascript|vbscript|data):/i.test(value))
      ) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (name === "style") {
        element.setAttribute(
          "style",
          value
            .replace(/expression\s*\([^)]*\)/gi, "")
            .replace(/url\(\s*(['"]?)\s*(javascript|vbscript):[^)]*\)/gi, "none"),
        );
      }

      if (name === "target" && value === "_blank") {
        element.setAttribute("rel", "noopener noreferrer");
      }
    });
  });

  const base = document.createElement("base");
  base.href = `${NEWSLETTER_ORIGIN}/`;
  document.head.prepend(base);

  const responsiveEmailStyles = document.createElement("style");
  responsiveEmailStyles.textContent = `
    html, body { margin: 0; padding: 0; }
    img { max-width: 100%; height: auto; }
    @media (max-width: 680px) {
      table[width="650"], .main-container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding-left: 18px !important; padding-right: 18px !important; }
    }
  `;
  document.head.append(responsiveEmailStyles);

  return `<!doctype html>${document.documentElement.outerHTML}`;
}

export default function NewsletterReader({ id }: { id: string }) {
  const [newsletter, setNewsletter] = useState<NewsletterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [emailFrameHeight, setEmailFrameHeight] = useState(900);
  const emailFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetchNewsletterDetail(id, controller.signal)
      .then(setNewsletter)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this newsletter right now.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, retryKey]);

  const safeContent = useMemo(
    () =>
      newsletter?.content_type === "HTML"
        ? ""
        : sanitizeNewsletterHtml(
            newsletter?.content_html || "",
            newsletter?.cover_image,
          ),
    [newsletter?.content_html, newsletter?.content_type, newsletter?.cover_image],
  );
  const emailDocument = useMemo(
    () => buildEmailDocument(newsletter?.content_html || ""),
    [newsletter?.content_html],
  );

  const resizeEmailFrame = () => {
    const frameDocument = emailFrameRef.current?.contentDocument;
    if (!frameDocument) return;

    const height = Math.max(
      frameDocument.documentElement.scrollHeight,
      frameDocument.body?.scrollHeight || 0,
    );
    if (height > 0) setEmailFrameHeight(height);
  };

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-6 py-12 sm:py-20">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 h-12 max-w-2xl animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-80 animate-pulse rounded-2xl bg-slate-100" />
      </main>
    );
  }

  if (error || !newsletter) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
        <FileText className="h-12 w-12 text-slate-300" />
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Newsletter unavailable
        </h1>
        <p className="mt-2 text-slate-600">
          {error || "This newsletter could not be found."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRetryKey((key) => key + 1)}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Try again
          </button>
          <Link
            href="/newsletters"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to newsletters
          </Link>
        </div>
      </main>
    );
  }

  const cover = getNewsletterAssetUrl(newsletter.cover_image);

  return (
    <div className="bg-white">
      <main className="w-full">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:py-6">
          <Link
            href="/newsletters"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 transition hover:text-orange-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all newsletters
          </Link>
        </div>

        <article className="mx-auto w-full max-w-6xl px-6 pt-2 pb-12 sm:pt-4 sm:pb-20">
          <div className="flex flex-wrap gap-2">
            {(newsletter.target_groups || []).map((group) => (
              <span
                key={group}
                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
              >
                {group}
              </span>
            ))}
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            {newsletter.title}
          </h1>
          {newsletter.short_description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {newsletter.short_description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span className="font-semibold text-slate-800">
              {newsletter.author || "StrideNex Team"}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatNewsletterDate(newsletter.published_at)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {(newsletter.total_views || 0).toLocaleString()} views
            </span>
          </div>

          {cover && newsletter.content_type !== "HTML" && (
            <div className="mt-9 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-800 to-orange-500">
              <img
                src={cover}
                alt={newsletter.title}
                className="max-h-[520px] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {newsletter.content_type === "HTML" && emailDocument ? (
            <iframe
              ref={emailFrameRef}
              title={newsletter.title}
              srcDoc={emailDocument}
              sandbox="allow-same-origin"
              referrerPolicy="no-referrer"
              onLoad={resizeEmailFrame}
              style={{ height: emailFrameHeight }}
              className="mt-10 w-full border-0"
            />
          ) : safeContent ? (
            <div
              className="prose prose-lg prose-slate mt-10 max-w-none break-words prose-headings:font-bold prose-a:text-blue-800 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          ) : (
            <p className="mt-10 rounded-xl bg-slate-50 p-5 text-slate-600">
              The full newsletter content is not available yet.
            </p>
          )}

          {newsletter.attachments?.length > 0 && (
            <section className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-lg font-bold text-slate-900">Attachments</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {newsletter.attachments.map((attachment) => {
                  const fileUrl = getNewsletterAttachmentUrl(
                    attachment.file_url,
                    attachment.file_name,
                  );
                  if (!fileUrl) return null;

                  return (
                    <a
                      key={`${attachment.file_name}-${attachment.file_url}`}
                      href={fileUrl}
                      download={attachment.file_name}
                      className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-800"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <span className="truncate">{attachment.file_name}</span>
                      <Download className="h-4 w-4 shrink-0" />
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </main>

      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:p-8">
            <div>
              <h2 className="text-2xl font-bold">Enjoyed reading?</h2>
              <p className="text-sm leading-6 text-blue-100">
                Subscribe for newsletter updates and mentoring insights.
              </p>
            </div>
            <NewsletterSubscribeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
