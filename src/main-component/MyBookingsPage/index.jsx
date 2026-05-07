import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatMoney, totalPrice } from "../../utils";

export default function MyBookingsPage() {
  const user = useSelector((s) => s.auth.currentUser);
  const orders = useSelector((s) => s.orders.list);

  const mine = useMemo(
    () =>
      [...orders]
        .filter((o) => o.userId === user?.id)
        .sort((a, b) => (b.placedAt ?? 0) - (a.placedAt ?? 0)),
    [orders, user?.id]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
              Your stays
            </p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              My bookings
            </h1>
            <p className="text-sm text-slate-600">
              Hello {user?.name} — confirmations and details from checkout.
            </p>
          </div>
          <Link
            to="/search-result"
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Book another room
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {mine.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-600">
              You don&apos;t have any bookings yet.
            </p>
            <Link
              to="/search-result"
              className="mt-4 inline-block font-semibold text-teal-700 hover:underline"
            >
              Browse rooms
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {mine.map((o) => (
              <li
                key={o.reference ?? o.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Reference
                    </p>
                    <p className="font-mono text-sm font-medium text-slate-900">
                      {o.reference}
                    </p>
                    <p className="text-xs text-slate-500">
                      {o.placedAt
                        ? new Date(o.placedAt).toLocaleString()
                        : ""}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Total
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      ${formatMoney(o.total ?? totalPrice(o.items))}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                      {(o.status ?? "confirmed").replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase text-slate-500">
                      Rooms
                    </p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {(o.items ?? []).map((it, i) => (
                        <li key={`${it.id}-${i}`}>
                          {it.title}{" "}
                          <span className="text-slate-500">
                            ×{it.qty} @ ${formatMoney(it.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase text-slate-500">
                      Guest & billing
                    </p>
                    {o.billing ? (
                      <div className="text-sm text-slate-700">
                        <p>
                          {o.billing.fname} {o.billing.lname}
                        </p>
                        <p>{o.billing.email}</p>
                        <p className="text-slate-600">{o.billing.phone}</p>
                        <p className="mt-1 text-slate-600">{o.billing.address}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">—</p>
                    )}
                    {o.paymentMethod && (
                      <p className="mt-2 text-xs text-slate-500">
                        Paid via {o.paymentMethod}
                        {o.cardLast4 ? ` (**** ${o.cardLast4})` : ""}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
