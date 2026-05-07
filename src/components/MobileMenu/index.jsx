import React, { Fragment, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Collapse from "../Collapse";
import { buildMobileMenu } from "../header/navigation";
import { logout } from "../../store/slices/authSlice";
import { clearCart } from "../../store/slices/cartSlice";
import "./style.css";

const MobileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.currentUser);
  const menus = useMemo(() => buildMobileMenu(user), [user]);
  const [openId, setOpenId] = useState(0);
  const [menuActive, setMenuState] = useState(false);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <div>
      <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
        <div className="menu-close">
          <div className="clox" onClick={() => setMenuState(!menuActive)}>
            <i className="ti-close"></i>
          </div>
        </div>

        <ul className="responsivemenu">
          {menus.map((item) => {
            return (
              <li
                className={item.id === openId ? "active" : undefined}
                key={item.id}
              >
                {item.submenu ? (
                  <Fragment>
                    <p
                      onClick={() =>
                        setOpenId(item.id === openId ? 0 : item.id)
                      }
                    >
                      {item.title}
                      <i
                        className={
                          item.id === openId
                            ? "fa fa-angle-up"
                            : "fa fa-angle-down"
                        }
                      ></i>
                    </p>
                    <Collapse in={item.id === openId} unmountOnExit>
                      <ul className="subMenu">
                        {item.submenu.map((submenu) => {
                          if (submenu.signOut) {
                            return (
                              <li key={submenu.id}>
                                <button
                                  type="button"
                                  className="mobile-submenu-btn"
                                  onClick={() => {
                                    dispatch(clearCart());
                                    dispatch(logout());
                                    ClickHandler();
                                    setMenuState(false);
                                    navigate("/");
                                  }}
                                >
                                  {submenu.title}
                                </button>
                              </li>
                            );
                          }
                          return (
                            <li key={submenu.id}>
                              <Link
                                onClick={() => {
                                  ClickHandler();
                                  setMenuState(false);
                                }}
                                className="active"
                                to={submenu.link}
                              >
                                {submenu.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </Collapse>
                  </Fragment>
                ) : (
                  <Link
                    className="active"
                    to={item.link}
                    onClick={() => {
                      ClickHandler();
                      setMenuState(false);
                    }}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="showmenu" onClick={() => setMenuState(!menuActive)}>
        <button
          type="button"
          className="navbar-toggler open-btn"
          aria-expanded={menuActive}
          aria-label={menuActive ? "Close menu" : "Open menu"}
        >
          <span className="icon-bar first-angle"></span>
          <span className="icon-bar middle-angle"></span>
          <span className="icon-bar last-angle"></span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
