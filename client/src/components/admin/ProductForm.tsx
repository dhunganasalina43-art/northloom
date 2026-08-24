"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ICategory, IProduct } from "@/types";
import { getCategories } from "@/services/category.service";
import { createProduct, updateProduct } from "@/services/product.service";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

/**
 * Shared create/edit product form. When `product` is passed it PUTs to
 * /products/:id, otherwise it POSTs a new product. Images are optional
 * on edit (existing images are kept) but required on create.
 */
export default function ProductForm({ product }: { product?: IProduct }) {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    stock: product?.stock?.toString() || "",
    category: typeof product?.category === "object" ? product.category._id : product?.category || "",
    tags: product?.tags?.join(", ") || "",
    is_featured: product?.is_featured || false,
  });
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const onChange = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, String(value)));
      if (images) Array.from(images).forEach((file) => fd.append("images", file));

      if (product) {
        await updateProduct(product._id, fd);
        toast.success("Product updated");
      } else {
        await createProduct(fd);
        toast.success("Product created");
      }
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <Input label="Name" value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
      <TextArea
        label="Description"
        rows={5}
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        required
        minLength={20}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => onChange("price", e.target.value)}
          required
        />
        <Input
          label="Compare-at price (optional)"
          type="number"
          step="0.01"
          value={form.compare_at_price}
          onChange={(e) => onChange("compare_at_price", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => onChange("stock", e.target.value)}
          required
        />
        <Select label="Category" value={form.category} onChange={(e) => onChange("category", e.target.value)} required>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </Select>
      </div>

      <Input
        label="Tags (comma separated)"
        value={form.tags}
        onChange={(e) => onChange("tags", e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-ink-900">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={(e) => onChange("is_featured", e.target.checked)}
        />
        Show in featured products on the home page
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium text-ink-900">
          Images {product ? "(optional — adds to existing)" : "(required, up to 6)"}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
