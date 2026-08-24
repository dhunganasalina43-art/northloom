"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth.context";
import withAuth from "@/hoc/withAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

type TProfileForm = { full_name: string; phone?: string };

function AccountPage() {
  const { user, refreshUser } = useAuth();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<TProfileForm>({
    defaultValues: { full_name: user?.full_name, phone: user?.phone },
  });

  const onSubmit = async (values: TProfileForm) => {
    try {
      await api.put("/users/profile", values);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not update profile");
    }
  };

  return (
    <div className="mx-auto max-w-lg py-6">
      <h1 className="font-serif text-3xl text-ink-900">Your account</h1>
      <div className="thread-rule my-4 w-16" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" value={user?.email} disabled />
        <Input label="Full name" {...register("full_name")} />
        <Input label="Phone" {...register("phone")} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

export default withAuth(AccountPage);
