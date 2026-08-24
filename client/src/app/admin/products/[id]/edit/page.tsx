"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "@/hoc/withAuth";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/services/product.service";
import { IProduct } from "@/types";

function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProductById(id).then((res) => setProduct(res.data)).finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Edit product</h1>
      <div className="thread-rule my-4 w-16" />
      {isLoading ? <p className="text-ink-900/60">Loading...</p> : product && <ProductForm product={product} />}
    </div>
  );
}

export default withAuth(EditProductPage, ["admin"]);
