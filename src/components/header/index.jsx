import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import MobileMenu from "../MobileMenu";
import {
  removeFromCart,
  clearCart,
} from "../../store/slices/cartSlice";
import { logout } from "../../store/slices/authSlice";
import { totalPrice } from "../../utils";
import shape from "../../images/hotel.png";
import { PRIMARY_NAV, getMoreNavItems, CONTACT_NAV } from "./navigation";

const Header = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const carts = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.currentUser);
  const moreNav = useMemo(() => getMoreNavItems(user), [user]);

  const [cartActive, setCartState] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    setCartState(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!cartActive) return;
    const onKey = (e) => {
      if (e.key === "Escape") setCartState(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cartActive]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const headerClass = [props.topbarBlock].filter(Boolean).join(" ");
  const siteHeaderClass = ["wpo-site-header", props.hclass]
    .filter(Boolean)
    .join(" ");

  const navLinkClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <header id="header" className={headerClass || undefined}>
      <div className={siteHeaderClass}>
        <nav
          className="navigation navbar navbar-expand-lg navbar-wpo"
          aria-label="Main navigation"
        >
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-3 col-md-3 d-lg-none dl-block">
                <div className="mobail-menu">
                  <MobileMenu />
                </div>
              </div>

              <div className="col-6 col-lg-2 col-md-6">
                <div className="navbar-header">
                  <NavLink
                    onClick={ClickHandler}
                    className="navbar-brand logo"
                    to="/"
                    end
                  >
                    <img src={props.Logo} alt="Parador Hotels" />
                  </NavLink>
                </div>
              </div>

              <div className="col-lg-8 d-none d-lg-block">
                <div
                  id="navbar"
                  className="navbar-collapse navigation-holder collapse show"
                >
                  <button type="button" className="menu-close">
                    <i className="ti-close"></i>
                  </button>
                  <ul className="nav navbar-nav mb-2 mb-lg-0">
                    {PRIMARY_NAV.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          end={item.end}
                          className={navLinkClass}
                          onClick={ClickHandler}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}

                    <li
                      ref={moreRef}
                      className={`menu-item-has-children${moreOpen ? " submenu-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="nav-more-toggle"
                        aria-expanded={moreOpen}
                        aria-haspopup="true"
                        aria-controls="nav-more-menu"
                        id="nav-more-button"
                        onClick={() => setMoreOpen((v) => !v)}
                      >
                        More
                        <span className="nav-more-caret" aria-hidden="true">
                          ▾
                        </span>
                      </button>
                      <ul className="sub-menu" id="nav-more-menu" role="menu">
                        {moreNav.map((item) => (
                          <li key={`${item.label}-${item.to}`} role="none">
                            {item.signOut ? (
                              <button
                                type="button"
                                role="menuitem"
                                className="dropdown-signout"
                                onClick={() => {
                                  dispatch(clearCart());
                                  dispatch(logout());
                                  setMoreOpen(false);
                                  navigate("/");
                                  ClickHandler();
                                }}
                              >
                                {item.label}
                              </button>
                            ) : (
                              <Link
                                role="menuitem"
                                to={item.to}
                                onClick={() => {
                                  ClickHandler();
                                  setMoreOpen(false);
                                }}
                              >
                                {item.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>

                    <li>
                      <NavLink
                        to={CONTACT_NAV.to}
                        className={navLinkClass}
                        onClick={ClickHandler}
                      >
                        {CONTACT_NAV.label}
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-3 col-md-3 col-lg-2 text-md-end">
                <div className="header-right">
                  <div className="header-search-form-wrapper"></div>

                  <Link
                    to="/search-result"
                    onClick={ClickHandler}
                    className="theme-btn header-book-cta d-none d-md-inline-flex"
                  >
                    Book
                  </Link>

                  <div className="mini-cart">
                    <button
                      type="button"
                      className="cart-toggle-btn"
                      aria-expanded={cartActive}
                      aria-controls="mini-cart-panel"
                      aria-label={`Shopping cart, ${carts.length} items`}
                      onClick={() => setCartState(!cartActive)}
                    >
                      <i className="fi flaticon-shopping-cart" aria-hidden="true"></i>
                      <span className="cart-count">{carts.length}</span>
                    </button>

                    <div
                      id="mini-cart-panel"
                      className={`mini-cart-content ${cartActive ? "mini-cart-content-toggle" : ""}`}
                      role="region"
                      aria-label="Cart summary"
                    >
                      <button
                        type="button"
                        className="mini-cart-close"
                        aria-label="Close cart"
                        onClick={() => setCartState(false)}
                      >
                        <i className="ti-close"></i>
                      </button>

                      {(!carts || carts.length === 0) && (
                        <p className="mini-cart-empty">
                          Your cart is empty.{" "}
                          <Link
                            to="/search-result"
                            onClick={() => {
                              ClickHandler();
                              setCartState(false);
                            }}
                          >
                            Browse rooms
                          </Link>
                        </p>
                      )}

                      <div className="mini-cart-items">
                        {carts &&
                          carts.length > 0 &&
                          carts.map((catItem, crt) => (
                            <div className="mini-cart-item clearfix" key={crt}>
                              <div className="mini-cart-item-image">
                                <span>
                                  <img src={catItem.proImg} alt="" />
                                </span>
                              </div>

                              <div className="mini-cart-item-des">
                                <p>{catItem.title} </p>
                                <span className="mini-cart-item-price">
                                  ${catItem.price} × {catItem.qty}
                                </span>

                                <span className="mini-cart-item-quantity">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      dispatch(removeFromCart(catItem.id))
                                    }
                                    className="btn btn-sm btn-danger"
                                    aria-label={`Remove ${catItem.title}`}
                                  >
                                    <i className="ti-close"></i>
                                  </button>
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="mini-cart-action clearfix">
                        <span className="mini-checkout-price">
                          Subtotal: <span>${totalPrice(carts)}</span>
                        </span>

                        <div className="mini-btn">
                          <Link
                            onClick={ClickHandler}
                            to="/checkout"
                            className="view-cart-btn s1"
                          >
                            Checkout
                          </Link>
                          <Link
                            onClick={ClickHandler}
                            to="/cart"
                            className="view-cart-btn"
                          >
                            View cart
                          </Link>
                        </div>
                      </div>

                      <div className="visible-icon">
                        <img src={shape} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
