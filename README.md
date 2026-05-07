# Parador — Hotel booking frontend

Single-page application for browsing rooms, managing a cart, and completing checkout. Includes **role-based access**, an **admin operations dashboard**, and **guest booking history**. Built as a portfolio-grade React demo; **no backend** — auth and data persist in the browser via **Redux + redux-persist** (localStorage).

---

## At a glance (for recruiters)

| Area | Details |
|------|---------|
| **Stack** | React 19, Vite 7, React Router 7, Redux Toolkit, redux-persist, Tailwind CSS 4, Bootstrap 5, SCSS (theme), React Toastify |
| **Patterns** | Functional components, Redux slices, listener middleware, protected routes, thunks for auth/cart gating |
| **Languages** | JavaScript (ES modules), JSX, SCSS |
| **Tooling** | ESLint, Vite build |

**Highlights for reviewers**

- **Guest flow:** marketing pages, room search/detail, cart, gated checkout, order confirmation.
- **Auth:** registration and login with persisted user store; only **signed-in users** can add rooms to the cart and complete checkout.
- **Guest account:** **My bookings** lists orders tied to the logged-in user after checkout.
- **Admin:** `/admin` dashboard (admin role only) with **Overview KPIs**, **room CRUD** (catalog drives the whole site), **bookings** with search/filter/sort, **CSV export**, **booking detail drawer** (billing, payment, line items, status timeline, internal notes).
- **UX:** Responsive layout; admin and “my bookings” use Tailwind; main site uses existing SCSS + Bootstrap components.

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build    # production bundle
npm run preview  # serve dist locally
npm run lint     # ESLint
```

---

## Demo accounts

Stored locally with the app (not suitable for production).

| Role | Email | Password |
|------|-------|----------|
| **Admin** |  |
| **Guest** | `client@parador.com` | `client123` |

New accounts can be created on **Create account**; they receive the **client** role.

---

## Main routes

| Path | Purpose |
|------|---------|
| `/`, `/home` | Homepage |
| `/search-result` | Room search & add to cart (auth required) |
| `/room-single/:roomId` | Room detail |
| `/cart` | Cart |
| `/checkout` | Checkout (protected — login required) |
| `/order_received` | Thank-you / last order summary |
| `/my-bookings` | Signed-in user’s booking history (protected) |
| `/admin` | Admin dashboard (protected, **admin** only) |
| `/login`, `/register` | Auth |

---

## Project structure (abbreviated)

```
src/
  main-component/     # Page-level views (Home, Checkout, Admin, etc.)
  components/         # Shared UI (Navbar, CheckoutSection, auth, …)
  store/
    slices/           # cart, auth, rooms, orders
    listeners/       # cart toasts, order recording after checkout
    thunks/            # addToCartIfAuthed, attemptLogin, registerUser
  sass/               # Legacy theme styles
  tailwind.css        # Tailwind entry
  App.jsx             # Global CSS + routes mount
```

---

## Important limitations (read before production use)

- **No server API** — users, passwords, orders, and inventory edits live in **localStorage**.
- **Passwords are plain text** in persisted state — acceptable only for demos; a real product needs hashing, HTTPS, and a secure backend.
- **Images** for rooms use paths under `public/` (e.g. `/product/*.jpg`) and theme assets under `src/images/`.

---

## Authoring note

This README is written so a **recruiter or hiring manager** can skim the table at the top, run the app with two commands, and log in with the demo accounts to explore **guest** vs **admin** flows without reading the codebase.
