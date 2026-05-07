import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  /** @type {Array<Record<string, unknown>>} */
  list: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    recordOrder(state, action) {
      const payload = action.payload;
      if (
        payload.reference &&
        state.list.some((o) => o.reference === payload.reference)
      ) {
        return;
      }
      const placed = payload.placedAt ?? Date.now();
      const initialStatus = payload.status ?? "confirmed";
      const roomNights = Array.isArray(payload.items)
        ? payload.items.reduce(
            (n, it) => n + Number(it.qty ?? 1),
            0
          )
        : 0;
      state.list.unshift({
        ...payload,
        id: payload.reference ?? `ord_${Date.now().toString(36)}`,
        adminNotes: "",
        statusHistory: [{ status: initialStatus, at: placed }],
        lastStatusChangeAt: placed,
        roomNightCount: roomNights,
      });
    },
    deleteOrder(state, action) {
      const id = action.payload;
      state.list = state.list.filter((o) => o.id !== id && o.reference !== id);
    },
    updateOrderStatus(state, action) {
      const { id, status } = action.payload;
      const row = state.list.find((o) => o.id === id || o.reference === id);
      if (!row) return;
      row.status = status;
      if (!row.statusHistory) row.statusHistory = [];
      const now = Date.now();
      row.statusHistory.push({ status, at: now });
      row.lastStatusChangeAt = now;
    },
    updateOrderAdminNotes(state, action) {
      const { id, adminNotes } = action.payload;
      const row = state.list.find((o) => o.id === id || o.reference === id);
      if (row) row.adminNotes = adminNotes ?? "";
    },
  },
});

export const {
  recordOrder,
  deleteOrder,
  updateOrderStatus,
  updateOrderAdminNotes,
} =
  ordersSlice.actions;
export default ordersSlice.reducer;
