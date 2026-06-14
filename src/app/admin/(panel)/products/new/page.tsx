import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getProductFormData } from "@/lib/admin-queries";

export default async function NewProductPage() {
  const { categories, industries } = await getProductFormData();

  return (
    <>
      <PageHeader title="New product" description="Add a product to the catalogue." />
      <ProductForm categories={categories as any} industries={industries as any} />
    </>
  );
}
