"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerSchema, TRegisterForm } from "@/schema/auth.schema";
import { useAuth } from "@/context/auth.context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: TRegisterForm) => {
    try {
      await registerUser(values);
      await login(values.email, values.password);
      toast.success("Account created — welcome to Northloom");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not create account");
    }
  };

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="font-serif text-3xl text-ink-900">Create an account</h1>
      <div className="thread-rule my-4 w-16" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name" {...register("full_name")} error={errors.full_name?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <Input label="Phone (optional)" {...register("phone")} error={errors.phone?.message} />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-900/60">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 hover:text-indigo-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
