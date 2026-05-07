import React, { useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/thunks/authThunks";

import "../LoginPage/style.scss";

const SignUpPage = () => {
  const push = useNavigate();
  const dispatch = useDispatch();

  const [value, setValue] = useState({
    email: "",
    full_name: "",
    password: "",
    confirm_password: "",
  });

  const [validator] = useState(
    new SimpleReactValidator({ className: "errorMessage" })
  );

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    validator.showMessages();
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      validator.hideMessages();
      const ok = dispatch(
        registerUser({
          name: value.full_name,
          email: value.email,
          password: value.password,
        })
      );
      if (ok) {
        push("/home");
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
            <h2 className="text-center">Signup</h2>
            <p className="text-center">Signup your account</p>

            <form onSubmit={submitForm}>
              <div className="row g-3">
                <div className="col-12">
                  <div className="inputOutline">
                    <label htmlFor="signup-name">Name</label>
                    <input
                      id="signup-name"
                      type="text"
                      name="full_name"
                      className="form-control"
                      value={value.full_name}
                      onChange={changeHandler}
                      onBlur={changeHandler}
                      autoComplete="name"
                    />
                  </div>
                  {validator.message("full name", value.full_name, "required")}
                </div>

                <div className="col-12">
                  <div className="inputOutline">
                    <label htmlFor="signup-email">E-mail</label>
                    <input
                      id="signup-email"
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
                    <label htmlFor="signup-password">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      name="password"
                      className="form-control"
                      value={value.password}
                      onChange={changeHandler}
                      onBlur={changeHandler}
                      autoComplete="new-password"
                    />
                  </div>
                  {validator.message("password", value.password, "required")}
                </div>

                <div className="col-12">
                  <div className="inputOutline">
                    <label htmlFor="signup-confirm">Confirm Password</label>
                    <input
                      id="signup-confirm"
                      type="password"
                      name="confirm_password"
                      className="form-control"
                      value={value.confirm_password}
                      onChange={changeHandler}
                      onBlur={changeHandler}
                      autoComplete="new-password"
                    />
                  </div>
                  {validator.message(
                    "confirm password",
                    value.confirm_password,
                    `required|in:${value.password}`
                  )}
                </div>

                <div className="col-12">
                  <div className="formFooter">
                    <button
                      type="submit"
                      className="cBtn cBtnLarge cBtnTheme w-100 btn border-0 py-2"
                    >
                      Sign Up
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
                    Already have an account?{" "}
                    <Link to="/login">Return to Sign In</Link>
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

export default SignUpPage;
