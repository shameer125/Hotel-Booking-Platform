import { toast } from "react-toastify";
import { login, register } from "../slices/authSlice";

export function attemptLogin({ email, password }) {
  return (dispatch, getState) => {
    dispatch(login({ email, password }));
    const ok = getState().auth.currentUser;
    if (!ok) {
      toast.error("Invalid email or password.");
      return false;
    }
    toast.success(`Welcome back, ${ok.name}!`);
    return true;
  };
}

export function registerUser({ name, email, password }) {
  return (dispatch, getState) => {
    const exists = getState().auth.users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      toast.error("That email is already registered.");
      return false;
    }
    dispatch(register({ name, email, password }));
    dispatch(login({ email, password }));
    const user = getState().auth.currentUser;
    if (user) toast.success(`Account created. Hello, ${user.name}!`);
    return true;
  };
}
