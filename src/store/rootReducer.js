import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import roomsReducer from "./slices/roomsSlice";
import ordersReducer from "./slices/ordersSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  rooms: roomsReducer,
  orders: ordersReducer,
});

export default rootReducer;
