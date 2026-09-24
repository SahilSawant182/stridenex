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

  if (!id) {
    return {
      title: "Blogs - StrideNex",
      description: "Read our latest blogs and updates.",
    };
  }

  try {
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

    const blog = blogs.find((b: any) => b.name === id);

    if (!blog) {
      return {
        title: "Blog - StrideNex",
        description: "Read this blog post on StrideNex.",
      };
    }

    /*
     * Always use the backend domain for blog images.
     *
     * This avoids using:
     * https://devstridenex.quantcloud.in/files/...
     *
     * because that dev hostname currently has an SSL certificate
     * mismatch on the server.
     */
    let imageUrl: string | undefined;

    if (blog.meta_image) {
      if (blog.meta_image.startsWith("http")) {
        imageUrl = blog.meta_image;
      } else {
        imageUrl = `${API_BASE_URL}${blog.meta_image}`;
      }
    }

    /*
     * Facebook should share the public StrideNex website URL,
     * never the backend URL.
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

      alternates: {
        canonical: blogUrl,
      },

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
    };
  }
}

export default function Page() {
  return <BlogsClient />;
}