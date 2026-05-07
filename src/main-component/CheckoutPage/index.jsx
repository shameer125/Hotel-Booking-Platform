import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageTitle from "../../components/pagetitle/PageTitle";
import Navbar from "../../components/Navbar";
import CheckoutSection from "../../components/CheckoutSection";
import Footer from "../../components/footer";
import Scrollbar from "../../components/scrollbar";
import Logo from "../../images/logo2.png";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartList = useSelector((state) => state.cart.cart);

  useEffect(() => {
    if (!cartList?.length) {
      toast.info("Add a room before checkout.");
      navigate("/search-result", { replace: true });
    }
  }, [cartList, navigate]);

  if (!cartList?.length) {
    return null;
  }

  return (
    <Fragment>
      <Navbar hclass={"wpo-header-style-3"} Logo={Logo} />
      <PageTitle pageTitle={"Checkout"} />
      <CheckoutSection cartList={cartList} />
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default CheckoutPage;
