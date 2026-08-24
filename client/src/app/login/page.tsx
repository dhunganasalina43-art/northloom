"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema, TLoginForm } from "@/schema/auth.schema";
import { useAuth } from "@/context/auth.context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: TLoginForm) => {
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.full_name.split(" ")[0]}`);
      router.push(user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="font-serif text-3xl text-ink-900">Log in</h1>
      <div className="thread-rule my-4 w-16" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-900/60">
        New to Northloom?{" "}
        <Link href="/register" className="text-indigo-600 hover:text-indigo-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
