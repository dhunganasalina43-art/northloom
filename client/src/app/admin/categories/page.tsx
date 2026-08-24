"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import withAuth from "@/hoc/withAuth";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/category.service";
import { ICategory } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => getCategories().then((res) => setCategories(res.data));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage(null);
    setEditingId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      if (image) fd.append("image", image);

      if (editingId) {
        await updateCategory(editingId, fd);
        toast.success("Category updated");
      } else {
        await createCategory(fd);
        toast.success("Category created");
      }
      resetForm();
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = (category: ICategory) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || "");
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    toast.success("Category deleted");
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Categories</h1>
      <div className="thread-rule my-4 w-16" />

      <div className="grid gap-10 md:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4">
          <h2 className="font-serif text-lg text-ink-900">{editingId ? "Edit category" : "Add category"}</h2>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div>
            <span className="mb-1 block text-sm font-medium text-ink-900">Image</span>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingId ? "Save changes" : "Add category"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="divide-y divide-ink-900/10 rounded-sm border border-ink-900/10 h-fit">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-ink-900">{c.name}</span>
              <div className="space-x-3">
                <button onClick={() => onEdit(c)} className="text-indigo-600 hover:text-indigo-700">Edit</button>
                <button onClick={() => onDelete(c._id)} className="text-weft-600 hover:text-weft-600/80">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminCategoriesPage, ["admin"]);
