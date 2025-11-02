# E-commerce API (Node.js, Express, MongoDB)

A simple, cookie-based authenticated REST API for an e-commerce backend. It supports user auth, product and category management, cart operations, and Stripe Checkout-based payments.

## Features

- User signup, login (JWT in HttpOnly cookie), and logout
- Role-based authorization (admin vs user)
- Product CRUD and filtering by keyword, category, and price range
- Category CRUD
- Shopping cart: add, update quantity, remove item, clear cart
- Stripe Checkout session creation for payments
- MongoDB models for Users, Products, Categories, Carts, Orders, and Payments

## Tech Stack

- Runtime: Node.js
- Framework: Express 5
- Database: MongoDB with Mongoose
- Auth: JWT (HttpOnly cookie)
- Payments: Stripe Checkout
- Env handling: dotenv

## Project Structure

```
backend/
  index.js
  package.json
  controllers/
    cart.controller.js
    category.controller.js
    payment.controller.js
    product.controller.js
    user.controller.js
  middlewares/
    isAdmin.js
    isAuthenticated.js
  models/
    cart.model.js
    category.model.js
    order.model.js
    payment.model.js
    product.model.js
    user.model.js
  routes/
    cart.route.js
    category.route.js
    payment.route.js
    product.route.js
    user.route.js
  utils/
    db.js
  README.md
  .env (not committed)
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- MongoDB database (Atlas or local)
- Stripe account and secret key

### Environment Variables

Create a `.env` file in `backend/` using the example below (see `.env.example` in this folder):

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
SECRET_KEY=replace-with-a-strong-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
```

- PORT: API server port
- MONGO_URI: MongoDB connection string
- SECRET_KEY: JWT signing secret
- STRIPE_SECRET_KEY: Stripe secret key for creating checkout sessions
- FRONTEND_URL: Frontend base URL for Stripe success/cancel redirects

### Install and Run

- Install dependencies
- Start the dev server (with auto-reload)

```
npm install
npm run dev
```

Server will start and attempt to connect to MongoDB. Routes are served under `/api/*`.

## Authentication

- Auth is cookie-based using JWT. After a successful login, a `token` HttpOnly cookie (1 day expiry) is set.
- Include this cookie in subsequent requests to access protected endpoints.
- Admin-only routes additionally check the authenticated user's `role === 'admin'`.

## API Reference

Base URL: `http://localhost:<PORT>/api`

### Users

- POST `/user/signup`
  - Body: `{ name, email, password, role? }`
  - Public: Creates a new user (role defaults to `user`).

- POST `/user/login`
  - Body: `{ email, password }`
  - Public: Sets HttpOnly `token` cookie on success.

- GET `/user/logout`
  - Auth: Clears the auth cookie.

### Products

All product routes require authentication. Admin-only where noted.

- POST `/product/new` (admin)
  - Body: `{ name, description, price, category?, stock }`
  - Creates a new product.

- POST `/product/update/:productId` (admin)
  - Body: `{ name?, description?, price?, category?, stock? }`
  - Updates the product.

- GET `/product/delete/:productId` (admin)
  - Deletes the product.

- GET `/product/get/:productId`
  - Returns a single product by id.

- GET `/product/get`
  - Query params: `keyword`, `category`, `minPrice`, `maxPrice`
  - Returns products filtered by the query parameters; `category` expects a Category ObjectId.

### Categories

All category routes require authentication and admin role.

- POST `/category/create`
  - Body: `{ name, description }`

- POST `/category/update/:categoryId`
  - Body: `{ name?, description? }`

- GET `/category/delete/:categoryId`

### Cart

All cart routes require authentication.

- POST `/cart/add`
  - Body: `{ productId, quantity }`
  - Adds a product to the cart or increases its quantity.

- GET `/cart/get`
  - Retrieves the current user's cart; products are populated with `name`, `price`, `description`, and `category`.

- GET `/cart/delete/:productId`
  - Removes a specific product from the cart.

- POST `/cart/changeQuantity`
  - Body: `{ productId, quantity }`
  - Sets quantity; removes item if `quantity <= 0`.

- GET `/cart/clearAll`
  - Clears the entire cart.

### Payments

All payment routes require authentication.

- POST `/payment/create-checkout-session`
  - Creates a Stripe Checkout session from the current cart.
  - Response: `{ success: true, url: <stripe_url> }`
  - Currency: `inr`
  - Success URL: `${FRONTEND_URL}/success`
  - Cancel URL: `${FRONTEND_URL}/cancel`

## Data Models (Mongoose)

- User: `{ name, email, password, role: 'admin'|'user', cart?: ObjectId }`
- Product: `{ name, description, price, stock, category?: ObjectId(ref Category) }`
- Category: `{ name, description }`
- Cart: `{ user: ObjectId(ref User), items: [{ productId: ObjectId(ref Product), quantity }], totalPrice }`
- Order: `{ user, products:[{ product, quantity }], status:'pending'|'paid'|'shipped', paymentId }` (present but not wired in routes)
- Payment: `{ order, user, amount, paymentStatus, paymentDate }`

## Notes and Caveats

- CORS is not configured in `index.js`; if your frontend is on a different origin, configure CORS and cookie settings appropriately (sameSite, secure, domain).
- `isAdmin` currently returns a plain JSON string message without an HTTP 403 status; you may want to standardize error statuses and bodies.
- Passwords are hashed with bcryptjs; JWT is signed with `SECRET_KEY`.

## Scripts

- `npm run dev` — start the dev server with nodemon

## License

ISC (see `package.json`).
