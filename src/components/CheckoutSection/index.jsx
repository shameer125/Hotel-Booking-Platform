import React, { Fragment, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { completeOrder } from "../../store/slices/cartSlice";
import Collapse from "../Collapse";
import FontAwesome from "../UiStyle/FontAwesome";
import { totalPrice, formatMoney } from "../../utils";
import { COUNTRY_OPTIONS } from "../../constants/countries";

import visa from "../../images/icon/visa.png";
import mastercard from "../../images/icon/mastercard.png";
import skrill from "../../images/icon/skrill.png";
import paypal from "../../images/icon/paypal.png";

import CheckWrap from "../CheckWrap";

import "./style.scss";

const cardType = [
  { title: "visa", img: visa },
  { title: "mastercard", img: mastercard },
  { title: "skrill", img: skrill },
  { title: "paypal", img: paypal },
];

const CheckoutSection = ({ cartList }) => {
  const [tabs, setExpanded] = useState({
    cupon: false,
    billing_adress: false,
    payment: true,
  });

  const [coupon, setCoupon] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);

  const [forms, setForms] = useState({
    cupon_key: "",
    fname: "",
    lname: "",
    country: "",
    dristrict: "",
    address: "",
    post_code: "",
    email: "",
    phone: "",
    note: "",
    payment_method: "card",
    card_type: "visa",
    fname2: "",
    lname2: "",
    country2: "",
    dristrict2: "",
    address2: "",
    post_code2: "",
    email2: "",
    phone2: "",
  });

  const [dif_ship, setDif_ship] = useState(false);

  const { subtotal, discountAmount, total } = useMemo(() => {
    const sub = totalPrice(cartList);
    const pct = coupon?.percent ?? 0;
    const disc =
      pct > 0 ? Math.round(sub * (pct / 100) * 100) / 100 : 0;
    const tot = Math.round(Math.max(0, sub - disc) * 100) / 100;
    return {
      subtotal: sub,
      discountAmount: disc,
      total: tot,
    };
  }, [cartList, coupon]);

  function faqHandler(name) {
    setExpanded({
      cupon: false,
      billing_adress: false,
      payment: true,
      [name]: !tabs[name],
    });
  }

  const changeHandler = (e) => {
    setForms({ ...forms, [e.target.name]: e.target.value });
  };

  const applyCoupon = () => {
    const raw = forms.cupon_key.trim().toUpperCase();
    if (!raw) {
      toast.info("Enter a coupon code.");
      return;
    }
    if (raw === "WELCOME10") {
      setCoupon({ code: "WELCOME10", percent: 10 });
      toast.success("10% discount applied.");
      return;
    }
    if (raw === "SAVE5") {
      setCoupon({ code: "SAVE5", percent: 5 });
      toast.success("5% discount applied.");
      return;
    }
    toast.error("That code isn’t valid.");
  };

  const buildBilling = () => ({
    fname: forms.fname.trim(),
    lname: forms.lname.trim(),
    country: forms.country,
    dristrict: forms.dristrict.trim(),
    address: forms.address.trim(),
    post_code: forms.post_code.trim(),
    email: forms.email.trim(),
    phone: forms.phone.trim(),
    note: dif_ship ? forms.note.trim() : forms.note.trim(),
    shipAlternate: dif_ship
      ? {
          fname: forms.fname2.trim(),
          lname: forms.lname2.trim(),
          country: forms.country2,
          dristrict: forms.dristrict2.trim(),
          address: forms.address2.trim(),
          post_code: forms.post_code2.trim(),
          email: forms.email2.trim(),
          phone: forms.phone2.trim(),
        }
      : null,
  });

  const ensureBilling = () => {
    const ok =
      forms.fname.trim() &&
      forms.lname.trim() &&
      forms.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forms.email.trim()) &&
      forms.phone.trim() &&
      forms.address.trim() &&
      forms.country;

    if (!ok) {
      toast.error(
        "Please complete billing: first & last name, valid email, phone, address, and country."
      );
      setExpanded((t) => ({ ...t, billing_adress: true }));
      return false;
    }

    if (dif_ship) {
      const altOk =
        forms.fname2.trim() &&
        forms.lname2.trim() &&
        forms.address2.trim() &&
        forms.country2;
      if (!altOk) {
        toast.error("Please complete the alternate shipping address.");
        setExpanded((t) => ({ ...t, billing_adress: true }));
        return false;
      }
    }
    return true;
  };

  const finishCheckout = (extra) => {
    if (!user) {
      toast.error("Please sign in to complete your booking.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    if (!cartList?.length) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!ensureBilling()) return;

    dispatch(
      completeOrder({
        billing: buildBilling(),
        subtotal,
        discount: discountAmount,
        total,
        couponCode: coupon?.code ?? null,
        ...extra,
      })
    );
    toast.success("Order placed successfully!");
    navigate("/order_received");
  };

  const countrySelect = (fieldName, label = "Country / region") => (
    <div className="col-sm-6 col-12">
      <label htmlFor={fieldName} className="form-label">
        {label}
      </label>
      <div className="formSelect formInput radiusNone">
        <select
          id={fieldName}
          className="form-control"
          value={forms[fieldName]}
          name={fieldName}
          onChange={changeHandler}
        >
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.value || "empty"} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const textField = (
    colClass,
    name,
    label,
    type = "text",
    multiline = false
  ) => (
    <div className={colClass}>
      <div className="formInput radiusNone">
        <label htmlFor={`chk-${name}`} className="form-label">
          {label}
        </label>
        {multiline ? (
          <textarea
            id={`chk-${name}`}
            className="form-control"
            rows={3}
            name={name}
            value={forms[name]}
            onChange={changeHandler}
          />
        ) : (
          <input
            id={`chk-${name}`}
            className="form-control"
            type={type}
            name={name}
            value={forms[name]}
            onChange={changeHandler}
          />
        )}
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className="checkoutWrapper section-padding">
        <div className="container">
          <div className="row g-3">
            <div className="col-lg-7 col-12">
              <div className="check-form-area">
                <div className="cuponWrap checkoutCard">
                  <button
                    type="button"
                    className="collapseBtn w-100"
                    onClick={() => faqHandler("cupon")}
                  >
                    Have a coupon? Click to enter your code.
                    <FontAwesome name={tabs.cupon ? "minus" : "plus"} />
                  </button>

                  <Collapse in={tabs.cupon} unmountOnExit>
                    <div className="chCardBody">
                      <p className="mb-2">
                        Try <strong>WELCOME10</strong> (10% off) or{" "}
                        <strong>SAVE5</strong> (5% off).
                      </p>
                      <div className="cuponForm">
                        <input
                          type="text"
                          className="form-control formInput radiusNone"
                          value={forms.cupon_key}
                          name="cupon_key"
                          onChange={changeHandler}
                          placeholder="Coupon code"
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          className="cBtn cBtnBlack btn border-0"
                          onClick={applyCoupon}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </Collapse>
                </div>

                <div className="cuponWrap checkoutCard">
                  <button
                    type="button"
                    className="collapseBtn w-100"
                    onClick={() => faqHandler("billing_adress")}
                  >
                    Billing &amp; contact
                    <FontAwesome
                      name={tabs.billing_adress ? "minus" : "plus"}
                    />
                  </button>

                  <Collapse in={tabs.billing_adress} unmountOnExit>
                    <div className="chCardBody">
                      <form
                        className="cuponForm"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <div className="row g-3">
                          {textField("col-sm-6 col-12", "fname", "First name")}
                          {textField("col-sm-6 col-12", "lname", "Last name")}
                          {countrySelect("country")}
                          {textField(
                            "col-sm-6 col-12",
                            "dristrict",
                            "State / province"
                          )}
                          {textField(
                            "col-12",
                            "address",
                            "Street address",
                            "text",
                            true
                          )}
                          {textField("col-sm-6 col-12", "post_code", "ZIP / postal code")}
                          {textField(
                            "col-sm-6 col-12",
                            "email",
                            "Email",
                            "email"
                          )}
                          {textField("col-12", "phone", "Phone", "tel")}

                          <div className="col-12">
                            <label className="checkBox d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                checked={dif_ship}
                                onChange={() => setDif_ship(!dif_ship)}
                              />
                              <span>Ship to a different address?</span>
                            </label>
                          </div>

                          <div className="col-12">
                            <Collapse in={dif_ship} unmountOnExit>
                              <div className="row g-3">
                                {textField(
                                  "col-sm-6 col-12",
                                  "fname2",
                                  "First name (shipping)"
                                )}
                                {textField(
                                  "col-sm-6 col-12",
                                  "lname2",
                                  "Last name (shipping)"
                                )}
                                {countrySelect("country2", "Country (shipping)")}
                                {textField(
                                  "col-sm-6 col-12",
                                  "dristrict2",
                                  "State / province"
                                )}
                                {textField(
                                  "col-12",
                                  "address2",
                                  "Address",
                                  "text",
                                  true
                                )}
                                {textField(
                                  "col-sm-6 col-12",
                                  "post_code2",
                                  "ZIP / postal code"
                                )}
                                {textField(
                                  "col-sm-6 col-12",
                                  "email2",
                                  "Email",
                                  "email"
                                )}
                                {textField("col-12", "phone2", "Phone", "tel")}
                              </div>
                            </Collapse>
                          </div>

                          <div className="col-12">
                            <div className="formInput radiusNone note">
                              <label htmlFor="chk-note" className="form-label">
                                Special requests / notes
                              </label>
                              <textarea
                                id="chk-note"
                                className="form-control"
                                placeholder="Late arrival, accessibility, celebration, etc."
                                name="note"
                                value={forms.note}
                                onChange={changeHandler}
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Collapse>
                </div>

                <div className="cuponWrap checkoutCard">
                  <button
                    type="button"
                    className="collapseBtn w-100"
                    onClick={() => faqHandler("payment")}
                  >
                    Payment
                    <FontAwesome name={tabs.payment ? "minus" : "plus"} />
                  </button>

                  <div className="chCardBody">
                    <Collapse in={tabs.payment}>
                      <>
                        <div
                          className="paymentMethod"
                          role="radiogroup"
                          aria-label="Payment method"
                        >
                          <label className="d-flex align-items-center gap-2">
                            <input
                              type="radio"
                              name="payment_method"
                              value="card"
                              checked={forms.payment_method === "card"}
                              onChange={changeHandler}
                            />
                            <span>Credit or debit card</span>
                          </label>
                          <label className="d-flex align-items-center gap-2">
                            <input
                              type="radio"
                              name="payment_method"
                              value="cod"
                              checked={forms.payment_method === "cod"}
                              onChange={changeHandler}
                            />
                            <span>Pay on arrival (cash at hotel)</span>
                          </label>
                        </div>

                        <Collapse in={forms.payment_method === "card"}>
                          <div className="cardType">
                            {cardType.map((item, i) => (
                              <div
                                key={i}
                                className={`cardItem ${forms.card_type === item.title ? "active" : ""}`}
                                onClick={() =>
                                  setForms({ ...forms, card_type: item.title })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    setForms({
                                      ...forms,
                                      card_type: item.title,
                                    });
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-pressed={forms.card_type === item.title}
                              >
                                <img src={item.img} alt="" />
                              </div>
                            ))}
                          </div>
                          <CheckWrap
                            disabled={!cartList?.length}
                            onPaid={({ cardLast4 }) => {
                              finishCheckout({
                                paymentMethod: "card",
                                cardBrand: forms.card_type,
                                cardLast4,
                              });
                            }}
                          />
                        </Collapse>

                        <Collapse in={forms.payment_method === "cod"}>
                          <div className="cardType">
                            <p className="mb-3">
                              You’ll pay when you check in. We’ll hold this
                              booking with the contact details you provided.
                            </p>
                            <button
                              type="button"
                              className="cBtn cBtnLarge cBtnTheme mt-20 ml-15 btn border-0"
                              disabled={!cartList?.length}
                              onClick={() =>
                                finishCheckout({
                                  paymentMethod: "cod",
                                })
                              }
                            >
                              Confirm booking
                            </button>
                          </div>
                        </Collapse>
                      </>
                    </Collapse>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-12">
              <div className="cartStatus">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="cartTotals">
                      <h4>Your stay</h4>
                      {!cartList?.length ? (
                        <p className="mb-3">
                          No rooms in your cart.{" "}
                          <Link to="/search-result">Browse availability</Link>
                        </p>
                      ) : (
                        <table className="table">
                          <tbody>
                            {cartList.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  {item.title} — ${formatMoney(item.price)} ×{" "}
                                  {item.qty}
                                </td>
                                <td className="text-end">
                                  ${formatMoney(
                                    Number(item.price) * Number(item.qty)
                                  )}
                                </td>
                              </tr>
                            ))}
                            <tr className="totalProduct">
                              <td>Lines</td>
                              <td className="text-end">{cartList.length}</td>
                            </tr>
                            <tr>
                              <td>Subtotal</td>
                              <td className="text-end">
                                ${formatMoney(subtotal)}
                              </td>
                            </tr>
                            {discountAmount > 0 && (
                              <tr>
                                <td>
                                  Discount
                                  {coupon?.code ? ` (${coupon.code})` : ""}
                                </td>
                                <td className="text-end">
                                  −${formatMoney(discountAmount)}
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td>
                                <strong>Total</strong>
                              </td>
                              <td className="text-end">
                                <strong>${formatMoney(total)}</strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CheckoutSection;
