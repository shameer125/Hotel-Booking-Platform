import React, { useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import "../LoginPage/style.scss";

const ForgotPassword = () => {
  const push = useNavigate();

  const [value, setValue] = useState({
    email: "",
  });

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    validator.showMessages();
  };

  const [validator] = React.useState(
    new SimpleReactValidator({
      className: "errorMessage",
    })
  );

  const submitForm = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      setValue({
        email: "",
      });
      validator.hideMessages();
      toast.success("You successfully Login!");
      push("/login");
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
            <h2 className="text-center">Forgot Password</h2>
            <p className="text-center">Reset your account password</p>
            <form onSubmit={submitForm}>
              <div className="row g-3">
                <div className="col-12">
                  <div className="inputOutline">
                    <label htmlFor="forgot-email">E-mail</label>
                    <input
                      id="forgot-email"
                      className="form-control"
                      type="email"
                      name="email"
                      value={value.email}
                      onBlur={changeHandler}
                      onChange={changeHandler}
                      autoComplete="email"
                    />
                  </div>
                  {validator.message("email", value.email, "required|email")}
                </div>
                <div className="col-12">
                  <div className="formFooter">
                    <button
                      type="submit"
                      className="cBtn cBtnLarge cBtnTheme w-100 btn border-0 py-2"
                    >
                      Resend Password
                    </button>
                  </div>
                  <div className="loginWithSocial text-center mt-3">
                    <button type="button" className="facebook border-0">
                      <i className="fa fa-facebook"></i>
                    </button>
                    <button type="button" className="twitter border-0">
                      <i className="fa fa-twitter"></i>
                    </button>
                    <button type="button" className="linkedin border-0">
                      <i className="fa fa-linkedin"></i>
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

export default ForgotPassword;
