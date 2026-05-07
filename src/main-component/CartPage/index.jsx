import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/pagetitle/PageTitle";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";
import Scrollbar from "../../components/scrollbar";
import { Link } from "react-router-dom";
import Logo from "../../images/logo2.png";

import {
  removeFromCart,
  increment,
  decrement,
} from "../../store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.cart.cart);

  const ClickHandler = () => window.scrollTo(10, 0);

  const totalPrice = carts.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0
  );

  return (
    <Fragment>
      <Navbar hclass={"wpo-header-style-3"} Logo={Logo} />
      <PageTitle pageTitle={"Cart"}  />

      <div className="cart-area section-padding">
        <div className="container">
          <div className="form">
            <div className="cart-wrapper">
              <div className="row">
                <div className="col-12">
                  <form>
                    <table className="table-responsive cart-wrap">
                      <thead>
                        <tr>
                          <th className="product-2">Room type</th>
                          <th className="pr">Capacity</th>
                          <th className="ptice">Quantity</th>
                          <th className="stock">Check - in</th>
                          <th className="stock">Check - out</th>
                          <th className="stock">Night</th>
                          <th className="stock">Gross Total</th>
                          <th className="remove remove-b">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {carts &&
                          carts.length > 0 &&
                          carts.map((catItem, crt) => (
                            <tr key={crt}>
                              <td className="product">
                                <ul>
                                  <li className="first-cart">
                                    {catItem.title}
                                  </li>
                                </ul>
                              </td>

                              <td className="ptice">
                                {catItem.capacity} adult
                              </td>
                              <td className="ptice">{catItem.qty}</td>

                              <td className="stock">December 23, 2026</td>
                              <td className="stock">December 25, 2026</td>

                              <td className="stock">
                                <div className="quantity cart-plus-minus">
                                  <button
                                    type="button"
                                    className="dec qtybutton border-0"
                                    onClick={() =>
                                      dispatch(decrement(catItem.id))
                                    }
                                  >
                                    -
                                  </button>

                                  <input
                                    value={catItem.qty}
                                    type="text"
                                    readOnly
                                  />

                                  <button
                                    type="button"
                                    className="inc qtybutton border-0"
                                    onClick={() =>
                                      dispatch(increment(catItem.id))
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              <td className="stock">
                                ${Number(catItem.qty) * Number(catItem.price)}
                              </td>

                              <td className="action">
                                <ul>
                                  <li
                                    className="w-btn"
                                    onClick={() =>
                                      dispatch(removeFromCart(catItem.id))
                                    }
                                  >
                                    <i className="fi ti-trash"></i>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </form>

                  <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/search-result"
                        >
                          Add Another{" "}
                        </Link>
                      </li>
                      <li>
                        <button type="button">Update Cart</button>
                      </li>
                    </ul>
                  </div>

                  <div className="cart-product-list">
                    <ul>
                      <li>
                        Total Room<span>( {carts.length} )</span>
                      </li>
                      <li>
                        Sub Price<span>${totalPrice}</span>
                      </li>
                      <li>
                        Vat<span>$0</span>
                      </li>
                      <li>
                        Eco Tax<span>$0</span>
                      </li>
                      <li>
                        Delivery Charge<span>$0</span>
                      </li>
                      <li className="cart-b">
                        Total Price<span>${totalPrice}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={(e) => {
                            if (!carts.length) e.preventDefault();
                            window.scrollTo(10, 0);
                          }}
                          className={`theme-btn ${!carts.length ? "disabled" : ""}`}
                          to={carts.length ? "/checkout" : "#"}
                        >
                          Proceed to Checkout
                        </Link>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default CartPage;
