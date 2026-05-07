import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import "./style.scss";

function digitsOnly(s) {
  return String(s ?? "").replace(/\D/g, "");
}

const CheckWrap = ({ onPaid, disabled }) => {
  const carts = useSelector((state) => state.cart.cart);

  const [value, setValue] = useState({
    card_holder: "",
    card_number: "",
    cvv: "",
    expire_date: "",
  });

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (disabled) return;

    if (!carts?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const holder = value.card_holder.trim();
    if (holder.length < 2) {
      toast.error("Enter the name on the card.");
      return;
    }

    const num = digitsOnly(value.card_number);
    if (num.length < 13 || num.length > 19) {
      toast.error("Enter a valid card number.");
      return;
    }

    const cvv = digitsOnly(value.cvv);
    if (cvv.length < 3 || cvv.length > 4) {
      toast.error("Enter the security code (CVV).");
      return;
    }

    if (!value.expire_date || !/^\d{4}-\d{2}$/.test(value.expire_date)) {
      toast.error("Select the card expiry month.");
      return;
    }

    const [y, m] = value.expire_date.split("-").map(Number);
    const lastDayOfMonth = new Date(y, m, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lastDayOfMonth < today) {
      toast.error("This card appears expired. Check the expiry date.");
      return;
    }

    onPaid?.({ cardLast4: num.slice(-4) });
  };

  return (
    <div className="cardbp mt-20">
      <form onSubmit={submitForm} noValidate>
        <div className="row g-3">
          <div className="col-sm-6 col-12">
            <div className="formInput radiusNone">
              <label htmlFor="card_holder" className="form-label">
                Name on card
              </label>
              <input
                id="card_holder"
                className="form-control"
                name="card_holder"
                value={value.card_holder}
                onChange={changeHandler}
                type="text"
                autoComplete="cc-name"
              />
            </div>
          </div>

          <div className="col-sm-6 col-12">
            <div className="formInput radiusNone">
              <label htmlFor="card_number" className="form-label">
                Card number
              </label>
              <input
                id="card_number"
                className="form-control"
                name="card_number"
                value={value.card_number}
                onChange={changeHandler}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="•••• •••• •••• ••••"
              />
            </div>
          </div>

          <div className="col-sm-6 col-12">
            <div className="formInput radiusNone">
              <label htmlFor="cvv" className="form-label">
                CVV
              </label>
              <input
                id="cvv"
                className="form-control"
                name="cvv"
                value={value.cvv}
                onChange={changeHandler}
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
              />
            </div>
          </div>

          <div className="col-sm-6 col-12">
            <div className="formInput radiusNone">
              <label htmlFor="expire_date" className="form-label">
                Expiry
              </label>
              <input
                id="expire_date"
                className="form-control"
                name="expire_date"
                value={value.expire_date}
                onChange={changeHandler}
                type="month"
                autoComplete="cc-exp"
              />
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="cBtn cBtnLarge cBtnTheme mt-20 ml-15 btn border-0 w-100"
              disabled={disabled}
            >
              Pay &amp; complete order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckWrap;
