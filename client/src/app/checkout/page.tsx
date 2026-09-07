"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { checkoutSchema, TCheckoutForm } from "@/schema/checkout.schema";
import { useCart } from "@/context/cart.context";
import { createOrder } from "@/services/order.service";
import withAuth from "@/hoc/withAuth";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";

const SHIPPING_FEE = 150;

function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TCheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: "cod" },
  });

  const subtotal = cart?.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;
  const total = subtotal + SHIPPING_FEE;

  const onSubmit = async (values: TCheckoutForm) => {
    try {
      const { payment_method, ...shipping_address } = values;
      const res = await createOrder({ shipping_address, payment_method });
      await refreshCart();
      toast.success("Order placed successfully");
      router.push(`/orders/${res.data._id}?confirmed=1`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not place order");
    }
  };

  if (!cart || cart.items.length === 0) {
    return <p className="text-ink-900/60">Your cart is empty. Add something before checking out.</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900">Checkout</h1>
      <div className="thread-rule my-4 w-16" />

      <div className="grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:col-span-2">
          <h2 className="font-serif text-lg text-ink-900">Shipping details</h2>

          <Input label="Full name" {...register("full_name")} error={errors.full_name?.message} />
          <Input label="Address" {...register("line1")} error={errors.line1?.message} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="City" {...register("city")} error={errors.city?.message} />
            <Input label="State / Province" {...register("state")} error={errors.state?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Postal code" {...register("postal_code")} error={errors.postal_code?.message} />
            <Input label="Country" {...register("country")} error={errors.country?.message} />
          </div>

          <Input label="Phone" {...register("phone")} error={errors.phone?.message} />

          <Select label="Payment method" {...register("payment_method")}>
            <option value="cod">Cash on delivery</option>
            <option value="card">Credit / debit card</option>
          </Select>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Placing order..." : "Place order"}
          </Button>
        </form>

        <div className="h-fit rounded-sm border border-ink-900/10 bg-linen-100 p-6">
          <h2 className="font-serif text-lg text-ink-900">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-900/70">
            {cart.items.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-ink-900/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-900/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-900/70">
              <span>Shipping</span>
              <span>{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex justify-between font-semibold text-ink-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CheckoutPage);
