import React, { Fragment, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/pagetitle/PageTitle";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";
import Scrollbar from "../../components/scrollbar";
import Logo from "../../images/logo2.png";
import { addToCartIfAuthed } from "../../store/thunks/cartThunks";
import { selectPublicRooms } from "../../store/selectors/roomsSelectors";

const RoomSinglePage = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectPublicRooms);
  const product = useMemo(
    () => products.find((p) => String(p.id) === String(roomId)),
    [products, roomId]
  );

  const ClickHandler = () => window.scrollTo(10, 0);

  if (!product) {
    return (
      <Fragment>
        <Navbar hclass={"wpo-header-style-3"} Logo={Logo} />
        <PageTitle pageTitle={"Room not found"} />
        <section className="wpo-shop-page section-padding">
          <div className="container text-center">
            <p className="mb-4">We could not find this room.</p>
            <Link
              to="/search-result"
              className="theme-btn"
              onClick={ClickHandler}
            >
              Back to search
            </Link>
          </div>
        </section>
        <Footer />
        <Scrollbar />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Navbar hclass={"wpo-header-style-3"} Logo={Logo} />
      <PageTitle pageTitle={product.title} />
      <section className="wpo-room-area section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="room-img">
                <img src={product.proImg} alt={product.title} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="room-content">
                <ul>
                  <li>
                    <i className="fi flaticon-expand-arrows"></i>
                    {product.sqm} sqm
                  </li>
                  <li>
                    <i className="fi flaticon-bed"></i>
                    {product.bedroom} Bed
                  </li>
                  <li>
                    <i className="fi flaticon-bathtub"></i>
                    {product.bathroom} Bathroom
                  </li>
                  <li>
                    <strong>Capacity:</strong> {product.capacity}
                  </li>
                  <li>
                    <strong>Max children:</strong> {product.Children}
                  </li>
                </ul>
                <h3>
                  ${product.price} <span>/ Night</span>
                </h3>
                {product.delPrice ? (
                  <p className="text-muted mb-3">
                    <del>${product.delPrice}</del>
                  </p>
                ) : null}
                <div className="add-to-cart">
                  <button
                    type="button"
                    className="theme-btn me-2"
                    onClick={() =>
                      dispatch(addToCartIfAuthed({ ...product, qty: 1 }))
                    }
                  >
                    Add to cart
                  </button>
                  <Link
                    to="/cart"
                    className="theme-btn me-2"
                    onClick={ClickHandler}
                  >
                    View cart
                  </Link>
                  <Link
                    to="/search-result"
                    className="theme-btn-s2"
                    onClick={ClickHandler}
                  >
                    More rooms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default RoomSinglePage;
