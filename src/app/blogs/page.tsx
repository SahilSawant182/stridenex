import BlogsClient from "./BlogsClient";
import { Metadata } from "next";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "https://officestridenex.quantcloud.in";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://stridenex.ai";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id;

  // Default metadata for the main blogs page
  if (!id) {
    return {
      title: "Blogs - StrideNex",
      description: "Read our latest blogs and updates.",
      openGraph: {
        title: "Blogs - StrideNex",
        description: "Read our latest blogs and updates.",
        url: `${SITE_URL}/blogs`,
        type: "website",
        siteName: "StrideNex",
        images: [
          {
            url: `${SITE_URL}/images/Logo.png`,
            width: 1200,
            height: 630,
            alt: "StrideNex Blogs",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blogs - StrideNex",
        description: "Read our latest blogs and updates.",
        images: [`${SITE_URL}/images/Logo.png`],
      },
    };
  }

  try {
    // Fetch blog data from the backend
    const res = await fetch(
      `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.get_blog_posts`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`Blog API returned ${res.status}`);
    }

    const data = await res.json();
    const blogs = data?.message?.data || [];

    // Find the blog matching the URL ?id=
    const blog = blogs.find((b: any) => b.name === id);

    if (!blog) {
      return {
        title: "Blog - StrideNex",
        description: "Read this blog post on StrideNex.",
        openGraph: {
          title: "Blog - StrideNex",
          description: "Read this blog post on StrideNex.",
          url: `${SITE_URL}/blogs?id=${encodeURIComponent(id)}`,
          type: "article",
          siteName: "StrideNex",
          images: [
            {
              url: `${SITE_URL}/images/Logo.png`,
              width: 1200,
              height: 630,
              alt: "StrideNex Blog",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: "Blog - StrideNex",
          description: "Read this blog post on StrideNex.",
          images: [`${SITE_URL}/images/Logo.png`],
        },
      };
    }

    /*
     * Build the blog image URL.
     *
     * Social media crawlers such as Facebook/LinkedIn should receive
     * the stable production backend URL:
     *
     * https://officestridenex.quantcloud.in/files/...
     *
     * If the API returns:
     *   /files/example.jpg
     * it becomes:
     *   https://officestridenex.quantcloud.in/files/example.jpg
     *
     * If the API returns:
     *   https://devstridenex.quantcloud.in/files/example.jpg
     * it is converted to:
     *   https://officestridenex.quantcloud.in/files/example.jpg
     */
    let imageUrl: string | undefined;

    if (blog.meta_image) {
      const metaImage = blog.meta_image.trim();
      const mediaBaseUrl = "https://officestridenex.quantcloud.in";

      if (metaImage.startsWith("http")) {
        try {
          const parsedUrl = new URL(metaImage);

          if (parsedUrl.pathname.startsWith("/files/")) {
            imageUrl = `${mediaBaseUrl}${parsedUrl.pathname}${parsedUrl.search}`;
          } else {
            imageUrl = metaImage;
          }
        } catch {
          imageUrl = metaImage;
        }
      } else {
        imageUrl = `${mediaBaseUrl}${metaImage}`;
      }
    }

    /*
     * IMPORTANT:
     * The public URL shared on Facebook/LinkedIn should always be
     * the StrideNex website URL, NOT the backend URL.
     *
     * Example:
     * https://stridenex.ai/blogs?id=xxxxx
     */
    const blogUrl = `${SITE_URL}/blogs?id=${encodeURIComponent(id)}`;

    const title = blog.title || "StrideNex Blog";

    const description =
      blog.meta_description ||
      blog.blog_intro ||
      "Read this blog post on StrideNex.";

    return {
      title,
      description,

      /*
       * Canonical URL
       */
      alternates: {
        canonical: blogUrl,
      },

      /*
       * Facebook / LinkedIn / other Open Graph metadata
       */
      openGraph: {
        title,
        description,
        url: blogUrl,
        type: "article",
        siteName: "StrideNex",

        ...(imageUrl
          ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
          : {}),
      },

      /*
       * Twitter / X metadata
       */
      twitter: {
        card: "summary_large_image",
        title,
        description,

        ...(imageUrl
          ? {
            images: [imageUrl],
          }
          : {}),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for blog:", error);

    return {
      title: "Blogs - StrideNex",
      description: "Read our latest blogs and updates.",
      openGraph: {
        title: "Blogs - StrideNex",
        description: "Read our latest blogs and updates.",
        url: `${SITE_URL}/blogs`,
        type: "website",
        siteName: "StrideNex",
        images: [
          {
            url: `${SITE_URL}/images/Logo.png`,
            width: 1200,
            height: 630,
            alt: "StrideNex Blogs",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blogs - StrideNex",
        description: "Read our latest blogs and updates.",
        images: [`${SITE_URL}/images/Logo.png`],
      },
    };
  }
}

export default function Page() {
  return <BlogsClient />;
}