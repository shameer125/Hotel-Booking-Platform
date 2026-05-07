import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addRoom,
  archiveRoom,
  restoreRoom,
  purgeRoomPermanently,
  updateRoom,
} from "../../store/slices/roomsSlice";
import {
  deleteOrder,
  updateOrderStatus,
  updateOrderAdminNotes,
} from "../../store/slices/ordersSlice";
import { logout } from "../../store/slices/authSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { formatMoney, totalPrice } from "../../utils";

const emptyRoom = () => ({
  title: "",
  price: "",
  delPrice: "",
  proImg: "/product/1.jpg",
  sqm: "45",
  bedroom: "1",
  bathroom: "1",
  capacity: "2",
  Children: "0",
});

const ORDER_STATUSES = [
  "confirmed",
  "checked_in",
  "completed",
  "cancelled",
];

function orderKey(o) {
  return String(o.id ?? o.reference);
}

function lineTotal(it) {
  const n = Number(it.price) * Number(it.qty ?? 1);
  return Number.isFinite(n) ? n : 0;
}

function exportBookingsCsv(rows) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const headers = [
    "reference",
    "guest",
    "email",
    "status",
    "total",
    "subtotal",
    "discount",
    "coupon",
    "placedAt",
    "room_nights",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((o) =>
      [
        esc(o.reference),
        esc(o.userName),
        esc(o.userEmail),
        esc(o.status),
        esc(o.total ?? totalPrice(o.items)),
        esc(o.subtotal ?? ""),
        esc(o.discount ?? ""),
        esc(o.couponCode ?? ""),
        esc(
          o.placedAt ? new Date(o.placedAt).toISOString() : ""
        ),
        esc(o.roomNightCount ?? ""),
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `parador-bookings-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported CSV.");
}

function statusHistoryList(o) {
  if (o.statusHistory?.length)
    return [...o.statusHistory].sort((a, b) => (a.at ?? 0) - (b.at ?? 0));
  return [
    {
      status: o.status ?? "confirmed",
      at: o.placedAt ?? Date.now(),
    },
  ];
}

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.currentUser);
  const rooms = useSelector((s) => s.rooms.items);
  const orders = useSelector((s) => s.orders.list);

  const [tab, setTab] = useState("overview");
  const [form, setForm] = useState(emptyRoom());
  const [editingId, setEditingId] = useState(null);
  const [roomSearch, setRoomSearch] = useState("");
  const [roomCatalogView, setRoomCatalogView] = useState("active");

  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBookings, setSortBookings] = useState("newest");

  const [detailKey, setDetailKey] = useState(null);
  const [detailNotesDraft, setDetailNotesDraft] = useState("");

  const selectedOrder = useMemo(() => {
    if (!detailKey) return null;
    return orders.find((o) => orderKey(o) === detailKey) ?? null;
  }, [orders, detailKey]);

  useEffect(() => {
    if (!selectedOrder) {
      setDetailNotesDraft("");
      return;
    }
    setDetailNotesDraft(selectedOrder.adminNotes ?? "");
  }, [selectedOrder]);

  const analytics = useMemo(() => {
    const active = orders.filter((o) => o.status !== "cancelled");
    const revenue = active.reduce(
      (s, o) => s + Number(o.total ?? totalPrice(o.items)),
      0
    );
    const nights = active.reduce(
      (s, o) =>
        s +
        (o.roomNightCount ??
          (Array.isArray(o.items)
            ? o.items.reduce((n, it) => n + Number(it.qty ?? 1), 0)
            : 0)),
      0
    );
    const guests = new Set(active.map((o) => o.userId).filter(Boolean)).size;
    const byStatus = ORDER_STATUSES.reduce((acc, st) => {
      acc[st] = orders.filter((o) => (o.status ?? "confirmed") === st).length;
      return acc;
    }, {});
    return {
      revenue,
      count: orders.length,
      activeCount: active.length,
      avg:
        active.length > 0
          ? Math.round((revenue / active.length) * 100) / 100
          : 0,
      uniqueGuests: guests,
      roomNightsBooked: nights,
      byStatus,
    };
  }, [orders]);

  const recentBookings = useMemo(() => {
    return [...orders]
      .sort((a, b) => (b.placedAt ?? 0) - (a.placedAt ?? 0))
      .slice(0, 6);
  }, [orders]);

  const activeRoomCount = useMemo(
    () => rooms.filter((r) => !r.archived).length,
    [rooms]
  );
  const archivedRoomCount = useMemo(
    () => rooms.filter((r) => r.archived).length,
    [rooms]
  );

  const filteredRooms = useMemo(() => {
    const base =
      roomCatalogView === "active"
        ? rooms.filter((r) => !r.archived)
        : rooms.filter((r) => r.archived);
    const q = roomSearch.trim().toLowerCase();
    if (!q) return base;
    return base.filter((r) => (r.title ?? "").toLowerCase().includes(q));
  }, [rooms, roomSearch, roomCatalogView]);

  const avgRoomRate = useMemo(() => {
    const base = rooms.filter((r) => !r.archived);
    const q = roomSearch.trim().toLowerCase();
    const list = !q
      ? base
      : base.filter((r) => (r.title ?? "").toLowerCase().includes(q));
    if (!list.length) return 0;
    const sum = list.reduce((s, r) => s + Number(r.price), 0);
    return Math.round((sum / list.length) * 100) / 100;
  }, [rooms, roomSearch]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    const q = orderSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        const ref = String(o.reference ?? "").toLowerCase();
        const em = String(o.userEmail ?? "").toLowerCase();
        const nm = String(o.userName ?? "").toLowerCase();
        return ref.includes(q) || em.includes(q) || nm.includes(q);
      });
    }
    if (statusFilter !== "all") {
      list = list.filter(
        (o) => (o.status ?? "confirmed") === statusFilter
      );
    }
    list.sort((a, b) => {
      if (sortBookings === "newest")
        return (b.placedAt ?? 0) - (a.placedAt ?? 0);
      if (sortBookings === "oldest")
        return (a.placedAt ?? 0) - (b.placedAt ?? 0);
      const ta = Number(a.total ?? totalPrice(a.items));
      const tb = Number(b.total ?? totalPrice(b.items));
      return sortBookings === "high" ? tb - ta : ta - tb;
    });
    return list;
  }, [orders, orderSearch, statusFilter, sortBookings]);

  const resetForm = () => {
    setForm(emptyRoom());
    setEditingId(null);
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      title: r.title ?? "",
      price: String(r.price ?? ""),
      delPrice: r.delPrice != null ? String(r.delPrice) : "",
      proImg: r.proImg ?? "/product/1.jpg",
      sqm: String(r.sqm ?? ""),
      bedroom: String(r.bedroom ?? ""),
      bathroom: String(r.bathroom ?? ""),
      capacity: String(r.capacity ?? ""),
      Children: String(r.Children ?? ""),
    });
  };

  const saveRoom = (e) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.price) {
      toast.error("Title and price are required.");
      return;
    }
    if (editingId != null) {
      dispatch(
        updateRoom({
          id: editingId,
          title: form.title,
          price: form.price,
          delPrice: form.delPrice,
          proImg: form.proImg,
          sqm: form.sqm,
          bedroom: form.bedroom,
          bathroom: form.bathroom,
          capacity: form.capacity,
          Children: form.Children,
        })
      );
      toast.success("Room updated.");
    } else {
      dispatch(addRoom({ ...form }));
      toast.success("Room added.");
    }
    resetForm();
  };

  const archiveRoomFromCatalog = (id, title) => {
    if (
      !window.confirm(
        `Archive “${title}”? It will be hidden from the public site but you can restore it from the Archived tab.`
      )
    )
      return;
    dispatch(archiveRoom(id));
    toast.success("Room archived — no longer visible to guests.");
    if (editingId === id) resetForm();
  };

  const restoreRoomToCatalog = (id) => {
    dispatch(restoreRoom(id));
    toast.success("Room restored to the live catalog.");
    if (editingId === id) resetForm();
  };

  const permanentlyRemoveRoom = (r) => {
    const typed = window.prompt(
      `Permanent delete: type the room title exactly:\n\n${r.title}`
    );
    if (typed !== r.title) {
      if (typed != null) toast.error("Title did not match — nothing deleted.");
      return;
    }
    if (
      !window.confirm(
        "This permanently removes the room from your data. Continue?"
      )
    )
      return;
    dispatch(purgeRoomPermanently(r.id));
    toast.info("Room permanently removed.");
    if (editingId === r.id) resetForm();
  };

  const removeOrder = (id) => {
    if (!window.confirm("Delete this booking record?")) return;
    dispatch(deleteOrder(id));
    toast.info("Order removed.");
    if (detailKey === id) setDetailKey(null);
  };

  const saveAdminNotes = () => {
    if (!selectedOrder) return;
    dispatch(
      updateOrderAdminNotes({
        id: orderKey(selectedOrder),
        adminNotes: detailNotesDraft,
      })
    );
    toast.success("Internal notes saved.");
  };

  const signOut = () => {
    dispatch(clearCart());
    dispatch(logout());
    navigate("/");
  };

  const closeDetail = () => setDetailKey(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50/40 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
              Parador · Operations
            </p>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Command center
            </h1>
            <p className="text-sm text-slate-500">
              {user?.name} · revenue, catalog, and booking intelligence
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl flex-wrap gap-1 border-t border-slate-100 px-2 sm:px-4">
          {[
            { id: "overview", label: "Overview · KPIs" },
            { id: "orders", label: "Bookings" },
            { id: "rooms", label: "Rooms" },
          ].map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setTab(x.id)}
              className={`rounded-t-lg border-b-2 px-3 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                tab === x.id
                  ? "border-teal-600 text-teal-800 bg-teal-50/50"
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {x.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Gross revenue",
                  sub: "excl. cancelled",
                  val: `$${formatMoney(analytics.revenue)}`,
                  accent: "from-teal-500 to-emerald-600",
                },
                {
                  label: "Active bookings",
                  sub: `${analytics.activeCount} of ${analytics.count} total`,
                  val: String(analytics.activeCount),
                  accent: "from-sky-500 to-indigo-600",
                },
                {
                  label: "Avg. order value",
                  sub: "active only",
                  val: `$${formatMoney(analytics.avg)}`,
                  accent: "from-violet-500 to-purple-600",
                },
                {
                  label: "Room-nights sold",
                  sub: `${analytics.uniqueGuests} unique guests`,
                  val: String(analytics.roomNightsBooked),
                  accent: "from-amber-500 to-orange-600",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${c.accent}`}
                  />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {c.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {c.val}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Pipeline by status
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                  Distribution across your operational workflow.
                </p>
                <ul className="space-y-3">
                  {ORDER_STATUSES.map((st) => {
                    const n = analytics.byStatus[st] ?? 0;
                    const pct =
                      analytics.count > 0
                        ? Math.round((n / analytics.count) * 100)
                        : 0;
                    return (
                      <li key={st}>
                        <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
                          <span className="capitalize">
                            {st.replace("_", " ")}
                          </span>
                          <span>
                            {n} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Recent bookings
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                  Latest activity — open details from Bookings.
                </p>
                <ul className="space-y-3">
                  {recentBookings.length === 0 ? (
                    <li className="text-sm text-slate-500">No data yet.</li>
                  ) : (
                    recentBookings.map((o) => (
                      <li
                        key={orderKey(o)}
                        className="flex items-start justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
                      >
                        <div>
                          <p className="font-mono text-xs text-slate-800">
                            {o.reference}
                          </p>
                          <p className="text-xs text-slate-600">
                            {o.userName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">
                            $
                            {formatMoney(o.total ?? totalPrice(o.items))}
                          </p>
                          <span className="mt-0.5 inline-block rounded-full bg-white px-2 py-0.5 text-[10px] font-medium uppercase text-teal-800 ring-1 ring-teal-200">
                            {(o.status ?? "confirmed").replace("_", " ")}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <button
                  type="button"
                  onClick={() => setTab("orders")}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2 text-sm font-semibold text-teal-800 hover:bg-slate-50"
                >
                  Go to bookings
                </button>
              </section>
            </div>
          </div>
        )}

        {tab === "rooms" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="lg:col-span-2 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
              <strong className="font-semibold">Safety:</strong> Removing a
              listing uses <strong>Archive</strong> (guests no longer see it;
              you can <strong>Restore</strong>). <strong>Purge</strong> only
              appears for archived rows and requires typing the room title.
              For public demos, set custom logins via{" "}
              <code className="rounded bg-white/80 px-1">.env</code> and see
              README — avoid shipping default admin passwords.
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase text-teal-800">
                  Catalog snapshot
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {activeRoomCount} live
                  <span className="text-base font-normal text-slate-600">
                    {" "}
                    · {archivedRoomCount} archived
                  </span>
                </p>
                <p className="text-sm text-slate-600">
                  Avg. live rate: ${formatMoney(avgRoomRate)} / night (active
                  listings)
                </p>
              </div>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId != null ? "Edit room" : "Add room"}
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                  Inventory syncs to the public site immediately.
                </p>
                <form onSubmit={saveRoom} className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-medium text-slate-600">
                      Title
                    </span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:ring-2"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Price / night
                    </span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:ring-2"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">
                      Compare-at price
                    </span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:ring-2"
                      value={form.delPrice}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, delPrice: e.target.value }))
                      }
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-medium text-slate-600">
                      Image path
                    </span>
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:ring-2"
                      value={form.proImg}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, proImg: e.target.value }))
                      }
                    />
                  </label>
                  {["sqm", "bedroom", "bathroom", "capacity", "Children"].map(
                    (k) => (
                      <label key={k} className="block">
                        <span className="text-xs font-medium text-slate-600">
                          {k === "Children" ? "Max children" : k}
                        </span>
                        <input
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500/30 focus:ring-2"
                          value={form[k]}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [k]: e.target.value }))
                          }
                        />
                      </label>
                    )
                  )}
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
                    >
                      {editingId != null ? "Save changes" : "Add room"}
                    </button>
                    {editingId != null && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-bold">Room catalog</h2>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Archive hides listings from guests; purge only after
                    archive.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setRoomCatalogView("active")}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                        roomCatalogView === "active"
                          ? "bg-teal-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Active ({activeRoomCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoomCatalogView("archived")}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                        roomCatalogView === "archived"
                          ? "bg-slate-800 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Archived ({archivedRoomCount})
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="search"
                    placeholder="Search in this tab…"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500/20 focus:ring-2 sm:max-w-xs"
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-[70vh] overflow-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="hidden px-4 py-3 sm:table-cell">Sqm</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRooms.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {r.title}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          ${formatMoney(r.price)}
                        </td>
                        <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                          {r.sqm}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => startEdit(r)}
                            className="mr-2 text-teal-700 hover:underline"
                          >
                            Edit
                          </button>
                          {roomCatalogView === "active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                archiveRoomFromCatalog(r.id, r.title)
                              }
                              className="text-amber-700 hover:underline"
                            >
                              Archive
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => restoreRoomToCatalog(r.id)}
                                className="mr-2 text-teal-700 hover:underline"
                              >
                                Restore
                              </button>
                              <button
                                type="button"
                                onClick={() => permanentlyRemoveRoom(r)}
                                className="text-rose-600 hover:underline"
                              >
                                Purge
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRooms.length === 0 && (
                  <p className="px-6 py-8 text-center text-slate-500">
                    No rooms match your search.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {tab === "orders" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Bookings & details</h2>
                <p className="text-sm text-slate-500">
                  {filteredOrders.length} shown · filters & export
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => exportBookingsCsv(filteredOrders)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 sm:text-sm"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-50 bg-slate-50/50 p-4 sm:flex-row sm:flex-wrap sm:items-end">
              <label className="block flex-1 min-w-[180px]">
                <span className="text-xs font-medium text-slate-600">
                  Search
                </span>
                <input
                  type="search"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-teal-500/20 focus:ring-2"
                  placeholder="Reference, name, email…"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </label>
              <label className="block w-full sm:w-40">
                <span className="text-xs font-medium text-slate-600">
                  Status
                </span>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-teal-500/20 focus:ring-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block w-full sm:w-44">
                <span className="text-xs font-medium text-slate-600">
                  Sort
                </span>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-teal-500/20 focus:ring-2"
                  value={sortBookings}
                  onChange={(e) => setSortBookings(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="high">Highest total</option>
                  <option value="low">Lowest total</option>
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Guest</th>
                    <th className="hidden px-4 py-3 md:table-cell">Nights</th>
                    <th className="hidden px-4 py-3 md:table-cell">Date</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => {
                    const key = orderKey(o);
                    const nights =
                      o.roomNightCount ??
                      (Array.isArray(o.items)
                        ? o.items.reduce(
                            (n, it) => n + Number(it.qty ?? 1),
                            0
                          )
                        : 0);
                    return (
                      <tr key={key} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-mono text-xs text-slate-800">
                          {o.reference}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {o.userName || "—"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {o.userEmail}
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                          {nights}
                        </td>
                        <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                          {o.placedAt
                            ? new Date(o.placedAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          ${formatMoney(o.total ?? totalPrice(o.items))}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="w-full min-w-[7.5rem] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium outline-none ring-teal-500/20 focus:ring-2"
                            value={o.status ?? "confirmed"}
                            onChange={(e) =>
                              dispatch(
                                updateOrderStatus({
                                  id: key,
                                  status: e.target.value,
                                })
                              )
                            }
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setDetailKey(key)}
                            className="mr-2 text-teal-700 hover:underline"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => removeOrder(key)}
                            className="text-rose-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <p className="px-6 py-12 text-center text-slate-500">
                  No bookings match your filters.
                </p>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Booking detail drawer */}
      {detailKey && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={closeDetail}
          />
          <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase text-teal-600">
                  Booking detail
                </p>
                <h3 className="font-mono text-lg font-bold text-slate-900">
                  {selectedOrder.reference}
                </h3>
                <p className="text-xs text-slate-500">
                  Placed{" "}
                  {selectedOrder.placedAt
                    ? new Date(selectedOrder.placedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <section className="mb-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <h4 className="text-xs font-bold uppercase text-slate-500">
                  Account & contact
                </h4>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Registered guest</dt>
                    <dd className="font-medium text-slate-900 text-right">
                      {selectedOrder.userName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Account email</dt>
                    <dd className="text-slate-800 text-right break-all">
                      {selectedOrder.userEmail}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">User id</dt>
                    <dd className="font-mono text-xs text-slate-600">
                      {selectedOrder.userId}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="mb-6">
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Rooms & rates
                </h4>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Room</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Each</th>
                        <th className="px-3 py-2 text-right">Line</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedOrder.items ?? []).map((it, i) => (
                        <tr key={`${it.id}-${i}`}>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              {it.proImg ? (
                                <img
                                  src={it.proImg}
                                  alt=""
                                  className="h-10 w-14 shrink-0 rounded-md object-cover"
                                />
                              ) : null}
                              <span>{it.title}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">{it.qty}</td>
                          <td className="px-3 py-2 text-right">
                            ${formatMoney(it.price)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            ${formatMoney(lineTotal(it))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Total room-nights (sum of qty):{" "}
                  <strong>
                    {selectedOrder.roomNightCount ??
                      (selectedOrder.items ?? []).reduce(
                        (n, it) => n + Number(it.qty ?? 1),
                        0
                      )}
                  </strong>
                </p>
              </section>

              <section className="mb-6 rounded-xl border border-slate-100 bg-teal-50/40 p-4">
                <h4 className="text-xs font-bold uppercase text-slate-500">
                  Financial summary
                </h4>
                <dl className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Subtotal</dt>
                    <dd>
                      $
                      {formatMoney(
                        selectedOrder.subtotal ??
                          totalPrice(selectedOrder.items)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Discount</dt>
                    <dd>
                      −$
                      {formatMoney(selectedOrder.discount ?? 0)}
                    </dd>
                  </div>
                  {selectedOrder.couponCode ? (
                    <div className="flex justify-between text-xs">
                      <dt className="text-slate-500">Coupon</dt>
                      <dd className="font-mono">{selectedOrder.couponCode}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between border-t border-teal-100 pt-2 text-base font-bold text-slate-900">
                    <dt>Total charged</dt>
                    <dd>
                      $
                      {formatMoney(
                        selectedOrder.total ??
                          totalPrice(selectedOrder.items)
                      )}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="mb-6">
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Payment
                </h4>
                <div className="rounded-xl border border-slate-200 p-4 text-sm">
                  <p>
                    <span className="text-slate-500">Method: </span>
                    <span className="font-medium capitalize">
                      {selectedOrder.paymentMethod ?? "—"}
                    </span>
                  </p>
                  {selectedOrder.cardBrand ? (
                    <p className="text-slate-600">
                      {selectedOrder.cardBrand}{" "}
                      {selectedOrder.cardLast4
                        ? `· ${selectedOrder.cardLast4}`
                        : ""}
                    </p>
                  ) : null}
                </div>
              </section>

              {selectedOrder.billing && (
                <section className="mb-6">
                  <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                    Billing address
                  </h4>
                  <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-800">
                    <p className="font-semibold">
                      {selectedOrder.billing.fname}{" "}
                      {selectedOrder.billing.lname}
                    </p>
                    <p>{selectedOrder.billing.email}</p>
                    <p>{selectedOrder.billing.phone}</p>
                    <p className="mt-2 text-slate-600">
                      {selectedOrder.billing.address}
                      {selectedOrder.billing.dristrict ? (
                        <span>, {selectedOrder.billing.dristrict}</span>
                      ) : null}
                      {selectedOrder.billing.post_code ? (
                        <span> {selectedOrder.billing.post_code}</span>
                      ) : null}
                    </p>
                    {selectedOrder.billing.country ? (
                      <p className="text-slate-600">
                        {selectedOrder.billing.country}
                      </p>
                    ) : null}
                    {selectedOrder.billing.note ? (
                      <p className="mt-3 border-t border-slate-100 pt-3 text-slate-600">
                        <span className="font-medium text-slate-700">
                          Guest note:{" "}
                        </span>
                        {selectedOrder.billing.note}
                      </p>
                    ) : null}
                  </div>

                  {selectedOrder.billing.shipAlternate ? (
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm">
                      <p className="mb-1 text-xs font-bold uppercase text-amber-900">
                        Alternate address
                      </p>
                      <p className="font-medium">
                        {selectedOrder.billing.shipAlternate.fname}{" "}
                        {selectedOrder.billing.shipAlternate.lname}
                      </p>
                      <p>{selectedOrder.billing.shipAlternate.email}</p>
                      <p>{selectedOrder.billing.shipAlternate.phone}</p>
                      <p className="mt-1 text-slate-700">
                        {selectedOrder.billing.shipAlternate.address}
                        {selectedOrder.billing.shipAlternate.post_code
                          ? `, ${selectedOrder.billing.shipAlternate.post_code}`
                          : ""}
                      </p>
                    </div>
                  ) : null}
                </section>
              )}

              <section className="mb-6">
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Status timeline
                </h4>
                <ul className="space-y-3 border-l-2 border-teal-200 pl-4">
                  {statusHistoryList(selectedOrder).map((h, i) => (
                    <li key={`${h.status}-${h.at}-${i}`} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-white" />
                      <p className="text-xs text-slate-500">
                        {h.at
                          ? new Date(h.at).toLocaleString()
                          : "—"}
                      </p>
                      <p className="font-medium capitalize text-slate-900">
                        {String(h.status).replace("_", " ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Internal notes (staff only)
                </h4>
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-teal-500/20 focus:ring-2"
                  rows={4}
                  placeholder="VIP request, housekeeping, payment follow-up…"
                  value={detailNotesDraft}
                  onChange={(e) => setDetailNotesDraft(e.target.value)}
                />
                <button
                  type="button"
                  onClick={saveAdminNotes}
                  className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Save notes
                </button>
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
