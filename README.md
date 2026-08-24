# Northloom — MERN E-Commerce Project

An original e-commerce site for home & lifestyle goods (linen textiles, stoneware, quiet
furniture), built with MongoDB, Express, React (Next.js App Router), and Node.js.

This project follows the same architectural approach as the reference sample you provided
(separated client/server, TypeScript throughout, JWT-in-httpOnly-cookie auth, role-based
middleware, `catchAsync` + centralized error handling, resource-based REST routes, Axios +
React Query-style service layer) but uses entirely original code, naming, domain, models,
and UI design.

---

## 1. Project Folder Tree

```
northloom/
├── server/                          # Express + TypeScript API
│   ├── src/
│   │   ├── app.ts                   # Express app: middleware, routes, error handler
│   │   ├── server.ts                # Entry point: connects DB, starts listener
│   │   ├── config/
│   │   │   ├── env.config.ts        # Centralised process.env access
│   │   │   ├── db.config.ts         # Mongoose connection
│   │   │   └── cloudinary.config.ts # Cloudinary SDK setup
│   │   ├── types/
│   │   │   ├── enum.types.ts        # Role, OrderStatus enums
│   │   │   └── express.d.ts         # req.user type augmentation
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── cart.model.ts
│   │   │   └── order.model.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── cart.controller.ts
│   │   │   └── order.controller.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts / user.routes.ts / category.routes.ts
│   │   │   ├── product.routes.ts / cart.routes.ts / order.routes.ts
│   │   │   └── index.ts             # mounts all routers under /api/v1
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts       # JWT verification + role guard
│   │   │   ├── upload.middleware.ts     # Multer disk storage
│   │   │   ├── errorHandler.middleware.ts
│   │   │   └── notFound.middleware.ts
│   │   └── utils/
│   │       ├── apiError.utils.ts / apiResponse.utils.ts / asyncHandler.utils.ts
│   │       ├── hash.utils.ts / token.utils.ts
│   │       ├── cloudinary.utils.ts / slugify.utils.ts / pagination.utils.ts
│   ├── uploads/                     # (unused placeholder; images go to Cloudinary)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── client/                          # Next.js 15 App Router frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx, providers.tsx, globals.css
    │   │   ├── page.tsx                       # Home
    │   │   ├── shop/page.tsx                  # Product listing (search/filter/sort)
    │   │   ├── product/[id]/page.tsx          # Product detail
    │   │   ├── cart/page.tsx
    │   │   ├── checkout/page.tsx
    │   │   ├── orders/page.tsx, orders/[id]/page.tsx
    │   │   ├── login/page.tsx, register/page.tsx, account/page.tsx
    │   │   └── admin/
    │   │       ├── layout.tsx, page.tsx (dashboard)
    │   │       ├── products/page.tsx, products/new/page.tsx, products/[id]/edit/page.tsx
    │   │       ├── categories/page.tsx
    │   │       ├── orders/page.tsx
    │   │       └── users/page.tsx
    │   ├── components/
    │   │   ├── layout/ (Navbar, Footer)
    │   │   ├── product/ (ProductCard, ProductGrid, ProductFilters)
    │   │   ├── cart/ (CartItemRow)
    │   │   ├── admin/ (ProductForm)
    │   │   └── ui/ (Button, Input, Select, TextArea)
    │   ├── context/ (auth.context.tsx, cart.context.tsx)
    │   ├── hoc/ (withAuth.tsx)
    │   ├── services/ (auth, category, product, cart, order — Axios call wrappers)
    │   ├── schema/ (auth.schema.ts, checkout.schema.ts — Zod validation)
    │   ├── lib/ (api.ts — shared Axios instance)
    │   └── types/ (index.ts — shared TS interfaces)
    ├── .env.local.example
    ├── package.json
    └── tailwind.config.ts
```

---

## 2. Database Schema Explanation

| Model | Key fields | Relationships |
|---|---|---|
| **User** | full_name, email (unique), password (hashed, `select: false`), role (`customer`/`admin`), avatar, addresses[] | referenced by Cart, Order |
| **Category** | name (unique), slug (unique), description, image | referenced by Product |
| **Product** | name, slug (unique), description, price, compare_at_price, stock, images[], category (ref), tags[], is_featured, rating_avg | belongs to Category |
| **Cart** | user (ref, unique — one cart per user), items[{ product (ref), quantity }] | belongs to User, references Product |
| **Order** | user (ref), items[{ product ref, name/price snapshot, quantity }], shipping_address, payment_method, subtotal, shipping_fee, total, status | belongs to User; item snapshots protect order history even if a product is later edited/deleted |

Snapshotting product `name`/`price` onto each order item (rather than only storing a
product reference) means order history stays accurate even if the admin later changes a
product's price or deletes it.

---

## 3. API Endpoint Table

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a customer account |
| POST | `/auth/login` | Public | Log in, sets httpOnly JWT cookie |
| POST | `/auth/logout` | Public | Clears the session cookie |
| GET | `/auth/me` | Any user | Get current user's profile |
| PUT | `/users/profile` | Any user | Update own full_name/phone |
| PUT | `/users/profile/avatar` | Any user | Upload/replace avatar (multipart) |
| POST | `/users/addresses` | Any user | Add a shipping address |
| GET | `/users` | Admin | List all customer accounts |
| GET | `/categories` | Public | List categories |
| GET | `/categories/:id` | Public | Get one category |
| POST | `/categories` | Admin | Create category (multipart, optional image) |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |
| GET | `/products` | Public | List products (`q`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`) |
| GET | `/products/featured` | Public | Featured products for the homepage |
| GET | `/products/:id` | Public | Product detail |
| POST | `/products` | Admin | Create product (multipart, up to 6 images) |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/cart` | Any user | Get own cart |
| POST | `/cart/items` | Any user | Add item `{ product_id, quantity }` |
| PATCH | `/cart/items/:itemId` | Any user | Change quantity `{ quantity }` |
| DELETE | `/cart/items/:itemId` | Any user | Remove one line item |
| DELETE | `/cart` | Any user | Empty the cart |
| POST | `/orders` | Any user | Checkout: create order from current cart |
| GET | `/orders` | Any user / Admin | List own orders (admin: all orders, filterable by `status`) |
| GET | `/orders/:id` | Any user / Admin | Order detail (owner or admin only) |
| PATCH | `/orders/:id/status` | Admin | Update order status |

Every successful response follows this shape:
```json
{ "success": true, "status": "success", "message": "...", "data": { }, "meta": { } }
```
Every error response follows:
```json
{ "success": false, "status": "fail" | "error", "message": "...", "data": null }
```

---

## 4. Authentication Flow

1. `POST /auth/register` hashes the password with bcrypt and stores the user (role defaults
   to `customer`).
2. `POST /auth/login` verifies the bcrypt hash, signs a JWT containing `{_id, full_name,
   email, role}`, and sets it as an **httpOnly, sameSite cookie** named `access_token`
   (never exposed to client-side JS — protects against XSS token theft).
3. On every subsequent request, `authenticate(roles?)` middleware reads that cookie,
   verifies the JWT signature/expiry, and attaches the decoded identity to `req.user`.
4. If a route is restricted (e.g. `authenticate([Role.ADMIN])`), the middleware also checks
   `req.user.role` against the allowed list and returns `403` if it doesn't match.
5. The frontend's `AuthProvider` calls `GET /auth/me` once on load (cookie sent
   automatically via `withCredentials: true`) to restore the session on page refresh — no
   token is ever stored in localStorage.
6. `withAuth(Component, roles?)` HOC redirects unauthenticated users to `/login` and
   non-admins away from `/admin/*`.

---

## 5. User Workflow (Customer)

1. Browse the home page → featured products & categories.
2. Go to **Shop**, search/filter/sort, open a **Product detail** page.
3. **Add to cart** (prompts login if not signed in) → adjust quantity or remove items on
   the **Cart** page.
4. **Checkout**: fill shipping address + payment method → `POST /orders` decrements stock,
   snapshots order items, clears the cart, and redirects to the **Order confirmation**
   page.
5. View **Order history** any time from the account menu; open any order for full detail.

## 6. Admin Workflow

1. Log in with an admin account → redirected to `/admin`.
2. **Dashboard**: quick counts of products/orders/customers.
3. **Products**: add/edit/delete products, upload images, mark as featured.
4. **Categories**: add/edit/delete categories with an optional cover image.
5. **Orders**: view every order, change its status through the lifecycle (`pending` →
   `processing` → `shipped` → `delivered`, or `cancelled`).
6. **Customers**: read-only list of registered accounts.

---

## 7. Setup Instructions

### 7.1 Required software
- Node.js **v18.18+** (v20 LTS recommended)
- npm (bundled with Node) or yarn/pnpm
- MongoDB **v6+** — either installed locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com) account (for product/category images)
- Git (optional, for version control)

### 7.2 MongoDB setup
- **Local**: install MongoDB Community Server, then it will run at `mongodb://127.0.0.1:27017`.
- **Atlas**: create a free cluster, add a database user, whitelist your IP, and copy the
  connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/northloom`).

### 7.3 Backend installation
```bash
cd server
npm install
cp .env.example .env
# edit .env: set DB_URI, JWT_SECRET, CLOUDINARY_* keys
npm run dev        # starts on http://localhost:5000 with ts-node + nodemon
```

### 7.4 Frontend installation
```bash
cd client
npm install
cp .env.local.example .env.local
# edit .env.local if your API runs on a different host/port
npm run dev         # starts on http://localhost:3000
```

### 7.5 Environment variables

**server/.env**
```
PORT=5000
NODE_ENV=development
DB_URI=mongodb://127.0.0.1:27017/northloom
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRY=7d
COOKIE_EXPIRY=7
ALLOW_ORIGINS=http://localhost:3000
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**client/.env.local**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

### 7.6 Creating your first admin account
There's no public "become admin" endpoint (by design — this must be a manual, deliberate
step). Register a normal account through the UI, then promote it directly in MongoDB:
```js
// in mongosh, connected to your northloom database
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

### 7.7 How to test the APIs
Use Postman, Insomnia, or `curl`. Because auth uses an httpOnly cookie, enable "send
cookies" / use a persistent cookie jar in your client so the session carries across
requests:
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Ada Lin","email":"ada@example.com","password":"secret123"}'

# Login (save cookies to a jar file)
curl -c cookies.txt -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret123"}'

# Authenticated request (reuse the cookie jar)
curl -b cookies.txt http://localhost:5000/api/v1/auth/me
```

### 7.8 How to access the website
With both servers running: open **http://localhost:3000**. Register an account, shop as a
customer, or log in with a promoted admin account and visit **http://localhost:3000/admin**.

---

## 8. Testing Plan & Test Cases

| # | Test case | Steps | Expected result |
|---|---|---|---|
| 1 | Register with valid data | POST `/auth/register` with full_name/email/password | 201, user returned without password field |
| 2 | Register with duplicate email | Register same email twice | 409 "An account with this email already exists" |
| 3 | Login with wrong password | POST `/auth/login` with bad password | 401 "Invalid email or password" |
| 4 | Access protected route without login | GET `/cart` with no cookie | 401 Unauthorized |
| 5 | Non-admin accesses admin route | GET `/users` as a customer | 403 Forbidden |
| 6 | Create product without image | POST `/products` (admin) with no files | 400 "at least one product image is required" |
| 7 | Add to cart beyond stock | POST `/cart/items` with quantity > stock | 400 "Only N unit(s) left in stock" |
| 8 | Checkout with empty cart | POST `/orders` with no cart items | 400 "Your cart is empty" |
| 9 | Successful checkout | Add items → POST `/orders` | 201, order created, product stock decremented, cart emptied |
| 10 | Customer views another user's order | GET `/orders/:id` for someone else's order | 403 Forbidden |
| 11 | Admin updates order status | PATCH `/orders/:id/status` with `"shipped"` | 200, order status updated |
| 12 | Product search | GET `/products?q=linen` | 200, only matching products returned |
| 13 | Pagination | GET `/products?page=2&limit=8` | 200, `meta.current_page = 2` |

---

## 9. Screenshot Guide (what to capture for documentation)

1. Home page — hero + featured products
2. Shop page — with an active category filter and search term
3. Product detail page — with quantity selector
4. Cart page with 2+ items
5. Checkout form filled in
6. Order confirmation page
7. Order history list
8. Admin dashboard
9. Admin product list + the "Add product" form
10. Admin orders page with the status dropdown open

---

## 10. Future Improvements

- Product reviews & ratings (model is easy to add: `Review { product, user, rating, comment }`)
- Wishlist / save-for-later
- Stripe/PayPal real payment integration (currently `card` is a placeholder value only)
- Email notifications on order placement/status change (Nodemailer is a natural fit, matching the sample's pattern)
- Admin analytics (revenue over time, best sellers)
- Product variants (size/color) with per-variant stock
- Server-side pagination cursor for very large catalogs
- Automated test suite (Jest + Supertest for the API, Playwright for the frontend)

---

## 11. Notes on How This Differs From the Uploaded Sample

The sample and Northloom share the same **method** (TypeScript Express + Mongoose,
Next.js App Router client, JWT-in-cookie auth, `catchAsync`/centralized error handler,
resource-based routers, Axios + Context state), but every concrete detail is original:
different domain (home goods vs. the sample's catalog), different model fields and names,
a Cart/Order system the sample didn't fully wire up, a different color/type identity
(indigo + linen + rust, rather than the sample's own styling), and entirely new component
and page code written from scratch for this brief.
