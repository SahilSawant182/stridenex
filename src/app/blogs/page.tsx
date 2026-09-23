import BlogsClient from "./BlogsClient";
import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") || 'https://devstridenex.quantcloud.in';

type Props = {
  searchParams: any;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const id = resolvedSearchParams?.id;
  
  if (id) {
    try {
      const res = await fetch(`${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.get_blog_posts`, { next: { revalidate: 60 } });
      const data = await res.json();
      if (data.message && data.message.data) {
        const blog = data.message.data.find((b: any) => b.name === id);
        if (blog) {
          const imageUrl = blog.meta_image 
            ? (blog.meta_image.startsWith('http') ? blog.meta_image : `${BASE_URL}${blog.meta_image}`) 
            : undefined;
            
          return {
            title: blog.title,
            description: blog.meta_description || blog.blog_intro || "Read this blog post on StrideNex.",
            openGraph: {
              title: blog.title,
              description: blog.meta_description || blog.blog_intro || "Read this blog post on StrideNex.",
              url: `${BASE_URL}/blogs?id=${id}`,
              images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
              type: "article",
            },
            twitter: {
              card: 'summary_large_image',
              title: blog.title,
              description: blog.meta_description || blog.blog_intro || "Read this blog post on StrideNex.",
              images: imageUrl ? [imageUrl] : [],
            }
          };
        }
      }
    } catch (e) {
      console.error("Error generating metadata for blog", e);
    }
  }

  return {
    title: "Blogs - StrideNex",
    description: "Read our latest blogs and updates.",
  };
}

export default function Page() {
  return <BlogsClient />;
}
