import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogFormData } from "@/lib/admin-queries";
import { DeletePostButton } from "../../delete-post-button";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { categories, post } = await getBlogFormData(id);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${post.title}`}
        description={`/blog/${post.slug}`}
        action={<DeletePostButton id={post.id} name={post.title} />}
      />
      <BlogForm post={post} categories={categories as any} />
    </>
  );
}
