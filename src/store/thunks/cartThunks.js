import { toast } from "react-toastify";
import { addToCart } from "../slices/cartSlice";

export function addToCartIfAuthed(product) {
  return (dispatch, getState) => {
    const user = getState().auth.currentUser;
    if (!user) {
      toast.error("Please sign in to book a room.");
      return false;
    }
    dispatch(addToCart(product));
    return true;
  };
}
