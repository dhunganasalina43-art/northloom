import { z } from "zod";

export const checkoutSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  line1: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/province is required"),
  postal_code: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  payment_method: z.enum(["cod", "card"]),
});

export type TCheckoutForm = z.infer<typeof checkoutSchema>;
