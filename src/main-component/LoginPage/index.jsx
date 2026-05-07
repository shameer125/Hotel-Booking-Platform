import React, { useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { attemptLogin } from "../../store/thunks/authThunks";

import "./style.scss";

const LoginPage = () => {
  const push = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [value, setValue] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [validator] = useState(
    new SimpleReactValidator({ className: "errorMessage" })
  );

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    validator.showMessages();
  };

  const rememberHandler = () => {
    setValue({ ...value, remember: !value.remember });
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      validator.hideMessages();
      const ok = dispatch(
        attemptLogin({ email: value.email, password: value.password })
      );
      if (ok) {
        const dest =
          location.state?.from &&
          location.state.from !== "/login" &&
          location.state.from !== "/register"
            ? location.state.from
            : "/home";
        push(dest);
      }
    } else {
      validator.showMessages();
      toast.error("Empty field is not allowed!");
    }
  };

  return (
    <div className="loginWrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4 loginForm">
            <h2 className="text-center">Sign In</h2>
            <p className="text-center">Sign in to book rooms and manage stays</p>
            <p className="text-center small text-muted mb-3">
              Demo: client@parador.com / client123 · Admin: admin@parador.com /
              admin123
            </p>

            <form onSubmit={submitForm}>
              <div className="row g-3">
                <div className="col-12 mb-3">
                  <div className="inputOutline">
                    <label htmlFor="login-email">E-mail</label>
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      className="form-control"
                      value={value.email}
                      onChange={changeHandler}
                      onBlur={changeHandler}
                      autoComplete="email"
                    />
                  </div>
                  {validator.message("email", value.email, "required|email")}
                </div>

                <div className="col-12">
                  <div className="inputOutline">
                    <label htmlFor="login-password">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      name="password"
                      className="form-control"
                      value={value.password}
                      onChange={changeHandler}
                      onBlur={changeHandler}
                      autoComplete="current-password"
                    />
                  </div>
                  {validator.message(
                    "password",
                    value.password,
                    "required"
                  )}
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center formAction">
                    <label className="d-flex align-items-center gap-2 mb-0">
                      <input
                        type="checkbox"
                        checked={value.remember}
                        onChange={rememberHandler}
                      />
                      <span>Remember Me</span>
                    </label>
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>

                  <div className="formFooter mt-3">
                    <button
                      type="submit"
                      className="cBtnTheme w-100 btn border-0 py-2"
                    >
                      Login
                    </button>
                  </div>

                  <div className="loginWithSocial text-center mt-3">
                    <button type="button" className="facebook me-2 border-0">
                      <i className="fa fa-facebook" />
                    </button>
                    <button type="button" className="twitter me-2 border-0">
                      <i className="fa fa-twitter" />
                    </button>
                    <button type="button" className="linkedin border-0">
                      <i className="fa fa-linkedin" />
                    </button>
                  </div>

                  <p className="noteHelp text-center mt-3">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Create free account</Link>
                  </p>
                </div>
              </div>
            </form>

            <div className="shape-img">
              <i className="fi flaticon-honeycomb"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
