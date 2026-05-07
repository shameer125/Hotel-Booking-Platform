/** Primary routes — shared by desktop header & mobile drawer */
export const PRIMARY_NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/room", label: "Rooms" },
  { to: "/destination", label: "Destinations" },
  { to: "/search-result", label: "Book now" },
];

export const MORE_NAV = [
  { to: "/service", label: "Services" },
  { to: "/pricing", label: "Packages & rates" },
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Checkout" },
  { to: "/login", label: "Sign in" },
  { to: "/register", label: "Create account" },
];

export const CONTACT_NAV = { to: "/contact", label: "Contact" };

/** Desktop "More" + mobile drawer — varies when signed in. */
export function getMoreNavItems(user) {
  const base = [
    { to: "/service", label: "Services" },
    { to: "/pricing", label: "Packages & rates" },
    { to: "/cart", label: "Cart" },
    { to: "/checkout", label: "Checkout" },
  ];
  if (!user) {
    return [
      ...base,
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Create account" },
    ];
  }
  return [
    ...base,
    { to: "/my-bookings", label: "My bookings" },
    ...(user.role === "admin"
      ? [{ to: "/admin", label: "Admin dashboard" }]
      : []),
    { to: "/login", label: "Sign out", signOut: true },
  ];
}

/** Mobile drawer tree (ids must be stable for expand/collapse state) */
export function buildMobileMenu(user) {
  let id = 0;
  const nid = () => ++id;

  const items = PRIMARY_NAV.map((item) => ({
    id: nid(),
    title: item.label,
    link: item.to,
  }));

  const moreItems = getMoreNavItems(user);

  items.push({
    id: nid(),
    title: "More",
    link: "/",
    submenu: moreItems.map((item) => ({
      id: nid(),
      title: item.label,
      link: item.to,
      signOut: item.signOut === true,
    })),
  });

  items.push({
    id: nid(),
    title: CONTACT_NAV.label,
    link: CONTACT_NAV.to,
  });

  return items;
}
