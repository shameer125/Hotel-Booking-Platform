import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  /** Snapshot after successful checkout (cart is cleared) — used on thank-you page */
  lastOrder: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const exist = state.cart.find((p) => p.id === item.id);

      if (exist) {
        exist.qty += item.qty || 1;
      } else {
        state.cart.push({ ...item, qty: item.qty || 1 });
      }
    },

    removeFromCart(state, action) {
      state.cart = state.cart.filter((p) => p.id !== action.payload);
    },

    increment(state, action) {
      const item = state.cart.find((p) => p.id === action.payload);
      if (item) item.qty += 1;
    },

    decrement(state, action) {
      const item = state.cart.find((p) => p.id === action.payload);
      if (item && item.qty > 1) item.qty -= 1;
    },

    clearCart(state) {
      state.cart = [];
    },

    /** Replace cart with order snapshot then clear cart */
    completeOrder(state, action) {
      const meta = action.payload ?? {};
      const items = state.cart.map((row) => ({ ...row }));
      if (!items.length) return;

      state.lastOrder = {
        items,
        placedAt: Date.now(),
        reference: `PAR-${Date.now().toString(36).toUpperCase()}`,
        ...meta,
      };
      state.cart = [];
    },

    clearLastOrder(state) {
      state.lastOrder = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increment,
  decrement,
  clearCart,
  completeOrder,
  clearLastOrder,
} = cartSlice.actions;

export default cartSlice.reducer;
