import React from "react";
import { Link } from "react-router-dom";
import { totalPrice, formatMoney } from "../../utils";
import "./style.scss";

const OrderRecivedSec = ({ order }) => {
  const items = order?.items ?? [];
  const hasLines = items.length > 0;

  return (
    <section className="cart-recived-section section-padding">
      <div className="container">
        <div className="row">
          <div className="order-top col-12">
            <h2>
              Thank you for your order!
              <span>We’ve sent a confirmation to your email.</span>
            </h2>
            {order?.reference && (
              <p className="order-ref mb-0">
                Reference: <strong>{order.reference}</strong>
              </p>
            )}
            <Link to="/home" className="theme-btn">
              Back to home
            </Link>
          </div>

          {!hasLines ? (
            <div className="cartStatus col-12 text-center py-5">
              <p className="mb-3">We couldn’t find order details on this device.</p>
              <Link to="/search-result" className="theme-btn">
                Book a room
              </Link>
            </div>
          ) : (
            <div className="cartStatus col-12">
              <div className="cartTotals">
                <h4>Order summary</h4>
                <table className="table">
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img src={item.proImg} alt="" /> {item.title} — $
                          {formatMoney(item.price)} × {item.qty}
                        </td>
                        <td className="text-end">
                          $
                          {formatMoney(Number(item.price) * Number(item.qty))}
                        </td>
                      </tr>
                    ))}
                    <tr className="totalProduct">
                      <td>Rooms</td>
                      <td className="text-end">{items.length}</td>
                    </tr>
                    <tr>
                      <td>Subtotal</td>
                      <td className="text-end">
                        ${formatMoney(order.subtotal ?? totalPrice(items))}
                      </td>
                    </tr>
                    {Number(order?.discount) > 0 && (
                      <tr>
                        <td>
                          Discount
                          {order.couponCode ? ` (${order.couponCode})` : ""}
                        </td>
                        <td className="text-end">
                          −${formatMoney(order.discount)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>
                        <b>Total</b>
                      </td>
                      <td className="text-end">
                        <b>${formatMoney(order.total ?? totalPrice(items))}</b>
                      </td>
                    </tr>
                    {order?.paymentMethod && (
                      <tr>
                        <td>Payment</td>
                        <td className="text-end">
                          {order.paymentMethod === "card"
                            ? `Card (${order.cardBrand ?? "card"} •••• ${order.cardLast4 ?? "????"})`
                            : "Pay on arrival"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
      
    </section>
  );
};

export default OrderRecivedSec;
