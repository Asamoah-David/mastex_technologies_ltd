import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getProductFormData } from "@/lib/admin-queries";
import { DeleteProductButton } from "../../delete-product-button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { categories, industries, product } = await getProductFormData(id);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${product.name}`}
        description={`/products/${product.slug}`}
        action={<DeleteProductButton id={product.id} name={product.name} />}
      />
      <ProductForm product={product} categories={categories as any} industries={industries as any} />
    </>
  );
}
