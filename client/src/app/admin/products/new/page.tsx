"use client";

import withAuth from "@/hoc/withAuth";
import ProductForm from "@/components/admin/ProductForm";

function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Add product</h1>
      <div className="thread-rule my-4 w-16" />
      <ProductForm />
    </div>
  );
}

export default withAuth(NewProductPage, ["admin"]);
