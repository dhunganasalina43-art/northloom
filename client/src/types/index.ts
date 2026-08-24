export type Role = "customer" | "admin";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IImage {
  url: string;
  public_id: string;
}

export interface IAddress {
  _id?: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface IUser {
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: IImage;
  addresses: IAddress[];
  createdAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: IImage;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  images: IImage[];
  category: ICategory | string;
  tags: string[];
  is_featured: boolean;
  rating_avg: number;
  rating_count: number;
  createdAt: string;
}

export interface ICartItem {
  _id: string;
  product: IProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
}

export interface IOrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder {
  _id: string;
  user: IUser | string;
  items: IOrderItem[];
  shipping_address: {
    full_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  payment_method: "cod" | "card";
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface IApiResponse<T> {
  success: boolean;
  status: string;
  message: string;
  data: T;
  meta?: {
    total_count: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
  };
}
