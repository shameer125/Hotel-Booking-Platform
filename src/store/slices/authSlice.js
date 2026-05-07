import { createSlice } from "@reduxjs/toolkit";
import { buildSeedUsers } from "../../config/authSeed";

const initialState = {
  users: buildSeedUsers(),
  currentUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register(state, action) {
      const { email, password, name } = action.payload;
      state.users.push({
        id: `u_${Date.now().toString(36)}`,
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        role: "client",
      });
    },
    login(state, action) {
      const { email, password } = action.payload;
      const u = state.users.find(
        (x) =>
          x.email.toLowerCase() === email.trim().toLowerCase() &&
          x.password === password
      );
      if (u) {
        state.currentUser = {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
        };
      } else {
        state.currentUser = null;
      }
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;
