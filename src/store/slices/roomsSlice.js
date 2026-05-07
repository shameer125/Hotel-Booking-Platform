import { createSlice } from "@reduxjs/toolkit";
import catalogSeed from "../../api/data.json";

const normalized = catalogSeed.map((r) => ({
  ...r,
  id: Number(r.id),
}));

const maxId = normalized.reduce((m, r) => Math.max(m, Number(r.id)), 0);

const initialState = {
  items: normalized,
  nextId: maxId + 1,
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addRoom(state, action) {
      const payload = action.payload;
      const id = state.nextId++;
      state.items.push({
        id,
        proImg: payload.proImg?.trim() || "/product/1.jpg",
        title: payload.title?.trim() || "New room",
        price: String(payload.price ?? "199"),
        delPrice: payload.delPrice ? String(payload.delPrice) : "",
        sqm: String(payload.sqm ?? "40"),
        bedroom: String(payload.bedroom ?? "1"),
        bathroom: String(payload.bathroom ?? "1"),
        capacity: String(payload.capacity ?? "2"),
        Children: String(payload.Children ?? "0"),
      });
    },
    updateRoom(state, action) {
      const { id, ...patch } = action.payload;
      const idx = state.items.findIndex((r) => Number(r.id) === Number(id));
      if (idx === -1) return;
      const prev = state.items[idx];
      state.items[idx] = {
        ...prev,
        ...patch,
        id: Number(id),
        price: patch.price != null ? String(patch.price) : prev.price,
        delPrice:
          patch.delPrice != null ? String(patch.delPrice) : prev.delPrice,
        sqm: patch.sqm != null ? String(patch.sqm) : prev.sqm,
        bedroom: patch.bedroom != null ? String(patch.bedroom) : prev.bedroom,
        bathroom:
          patch.bathroom != null ? String(patch.bathroom) : prev.bathroom,
        capacity:
          patch.capacity != null ? String(patch.capacity) : prev.capacity,
        Children:
          patch.Children != null ? String(patch.Children) : prev.Children,
      };
    },
    deleteRoom(state, action) {
      const id = Number(action.payload);
      state.items = state.items.filter((r) => Number(r.id) !== id);
    },
  },
});

export const { addRoom, updateRoom, deleteRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
