/**
 * Initial demo users — never commit real production passwords.
 *
 * - Set all four VITE_* vars in `.env.local` to use your own seed accounts.
 * - Production: set `VITE_DISABLE_DEMO_LOGIN=true` to start with **no** seed
 *   users (recommended for public deploys). You’ll need another way to create
 *   an admin (e.g. backend or one-time bootstrap — this app is frontend-only).
 * - Development: if env vars are missing and demo is not disabled, built-in
 *   dev fallbacks apply (see below) so `npm run dev` works without a `.env` file.
 */

const DEV_FALLBACK_ADMIN = {
  id: "u_admin",
  email: "admin@parador.com",
  password: "admin123",
  name: "Administrator",
  role: "admin",
};

const DEV_FALLBACK_CLIENT = {
  id: "u_demo",
  email: "client@parador.com",
  password: "client123",
  name: "Demo Guest",
  role: "client",
};

export function buildSeedUsers() {
  const ae = import.meta.env.VITE_ADMIN_EMAIL?.trim();
  const ap = import.meta.env.VITE_ADMIN_PASSWORD;
  const ce = import.meta.env.VITE_CLIENT_EMAIL?.trim();
  const cp = import.meta.env.VITE_CLIENT_PASSWORD;

  const envComplete = Boolean(ae && ap && ce && cp);
  if (envComplete) {
    return [
      {
        id: "u_admin",
        email: ae.toLowerCase(),
        password: ap,
        name: "Administrator",
        role: "admin",
      },
      {
        id: "u_demo",
        email: ce.toLowerCase(),
        password: cp,
        name: "Demo Guest",
        role: "client",
      },
    ];
  }

  if (import.meta.env.PROD && import.meta.env.VITE_DISABLE_DEMO_LOGIN === "true") {
    return [];
  }

  if (import.meta.env.DEV) {
    return [DEV_FALLBACK_ADMIN, DEV_FALLBACK_CLIENT];
  }

  // Production without env and without disable flag: minimal demo for hosted portfolios
  return [DEV_FALLBACK_ADMIN, DEV_FALLBACK_CLIENT];
}

export function isDemoLoginHintVisible() {
  return (
    import.meta.env.DEV &&
    import.meta.env.VITE_DISABLE_DEMO_LOGIN !== "true" &&
    !import.meta.env.VITE_ADMIN_EMAIL
  );
}
