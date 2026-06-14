import { PageHeader } from "@/components/admin/page-header";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogFormData } from "@/lib/admin-queries";

export default async function NewPostPage() {
  const { categories } = await getBlogFormData();
  return (
    <>
      <PageHeader title="New post" description="Write and publish a blog post." />
      <BlogForm categories={categories as any} />
    </>
  );
}
