import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";
import Scrollbar from "../../components/scrollbar";
import PageTitle from "../../components/pagetitle/PageTitle";
import OrderRecivedSec from "../../components/OrderRecivedSec";
import Logo from "../../images/logo2.png";

const OrderRecived = () => {
  const lastOrder = useSelector((state) => state.cart.lastOrder);
  const user = useSelector((state) => state.auth.currentUser);

  return (
    <Fragment>
      <Navbar hclass={"wpo-header-style-3"} Logo={Logo} />
      <PageTitle pageTitle={"Order received"} />
      {user && (
        <div className="bg-slate-50 py-4">
          <div className="container max-w-3xl text-center">
            <p className="mb-3 text-sm text-slate-600">
              This booking is saved to your account.
            </p>
            <Link
              to="/my-bookings"
              className="inline-flex rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              View all my bookings
            </Link>
          </div>
        </div>
      )}
      <OrderRecivedSec order={lastOrder} />
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default OrderRecived;
