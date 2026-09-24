import BlogsClient from "./BlogsClient";
import { Metadata } from "next";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "https://officestridenex.quantcloud.in";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://stridenex.ai";

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

    // Image is coming from Frappe/backend.
    // If meta_image is already a complete URL, use it directly.
    // Otherwise prepend the backend URL.
    const imageUrl = blog.meta_image
      ? blog.meta_image.startsWith("http")
        ? blog.meta_image
        : `${API_BASE_URL}${blog.meta_image}`
      : undefined;

    // IMPORTANT:
    // Facebook should receive the public website URL,
    // NOT the backend/officestridenex URL.
    const blogUrl = `${SITE_URL}/blogs?id=${encodeURIComponent(id)}`;

    const title = blog.title || "StrideNex Blog";

    const description =
      blog.meta_description ||
      blog.blog_intro ||
      "Read this blog post on StrideNex.";

    return {
      title,
      description,

      openGraph: {
        title,
        description,
        url: blogUrl,

        ...(imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }),

        type: "article",
        siteName: "StrideNex",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,

        ...(imageUrl && {
          images: [imageUrl],
        }),
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