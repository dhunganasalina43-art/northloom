/** User roles used for role-based authorization throughout the app. */
export enum Role {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

/** Lifecycle states an order moves through. */
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}
