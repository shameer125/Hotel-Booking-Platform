import { createListenerMiddleware } from "@reduxjs/toolkit";
import { completeOrder } from "../slices/cartSlice";
import { recordOrder } from "../slices/ordersSlice";

export const ordersListener = createListenerMiddleware();

ordersListener.startListening({
  actionCreator: completeOrder,
  effect: (_action, listenerApi) => {
    const { cart, auth } = listenerApi.getState();
    const last = cart.lastOrder;
    const user = auth.currentUser;
    if (!last?.items?.length || !user) return;

    listenerApi.dispatch(
      recordOrder({
        reference: last.reference,
        placedAt: last.placedAt,
        items: last.items,
        billing: last.billing,
        subtotal: last.subtotal,
        discount: last.discount,
        total: last.total,
        paymentMethod: last.paymentMethod,
        cardLast4: last.cardLast4,
        cardBrand: last.cardBrand,
        couponCode: last.couponCode,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        status: "confirmed",
      })
    );
  },
});
