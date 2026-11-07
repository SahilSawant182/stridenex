"use server";

export interface ServerYouTubeMetadata {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
  uploadDate?: string;
  lengthSeconds?: number;
  viewCount?: number;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\\u0026/g, "&");
}

export async function getYouTubeVideoDetailsServer(
  videoId: string
): Promise<ServerYouTubeMetadata | null> {
  if (!videoId) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

  try {
    const [watchRes, oembedRes] = await Promise.allSettled([
      fetch(watchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    let title: string | undefined;
    let author_name: string | undefined;
    let thumbnail_url: string | undefined;
    let uploadDate: string | undefined;
    let lengthSeconds: number | undefined;
    let viewCount: number | undefined;

    if (oembedRes.status === "fulfilled" && oembedRes.value.ok) {
      const oembedData = await oembedRes.value.json();
      title = oembedData?.title;
      author_name = oembedData?.author_name;
      thumbnail_url = oembedData?.thumbnail_url;
    }

    if (watchRes.status === "fulfilled" && watchRes.value.ok) {
      const html = await watchRes.value.text();

      const rawUploadDate =
        html.match(/itemprop="uploadDate"\s+content="([^"]+)"/)?.[1] ||
        html.match(/itemprop="datePublished"\s+content="([^"]+)"/)?.[1] ||
        html.match(/"uploadDate":"([^"]+)"/)?.[1] ||
        html.match(/"publishDate":"([^"]+)"/)?.[1];

      if (rawUploadDate) {
        uploadDate = rawUploadDate;
      }

      const rawLength = html.match(/"lengthSeconds":"(\d+)"/)?.[1];
      if (rawLength) {
        const parsedLength = Number(rawLength);
        if (!Number.isNaN(parsedLength) && parsedLength > 0) {
          lengthSeconds = parsedLength;
        }
      }

      const rawViews = html.match(/"viewCount":"(\d+)"/)?.[1];
      if (rawViews) {
        const parsedViews = Number(rawViews);
        if (!Number.isNaN(parsedViews) && parsedViews >= 0) {
          viewCount = parsedViews;
        }
      }

      if (!title) {
        const metaTitle =
          html.match(/<meta\s+name="title"\s+content="([^"]+)"/)?.[1] ||
          html.match(/property="og:title"\s+content="([^"]+)"/)?.[1];
        if (metaTitle) {
          title = decodeHtmlEntities(metaTitle);
        }
      }

      if (!author_name) {
        const rawAuthor =
          html.match(/itemprop="author"[\s\S]*?itemprop="name"\s+content="([^"]+)"/)?.[1] ||
          html.match(/"ownerChannelName":"([^"]+)"/)?.[1];
        if (rawAuthor) {
          author_name = decodeHtmlEntities(rawAuthor);
        }
      }
    }

    if (!title && !uploadDate && !lengthSeconds) {
      return null;
    }

    return {
      title,
      author_name,
      thumbnail_url,
      uploadDate,
      lengthSeconds,
      viewCount,
    };
  } catch {
    return null;
  }
}
