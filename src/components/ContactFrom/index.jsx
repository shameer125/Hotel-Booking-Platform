import React, { useState } from "react";
import SimpleReactValidator from "simple-react-validator";

const ContactForm = () => {
  const [forms, setForms] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [successMsg, setSuccessMsg] = useState(""); 
  const [validator] = useState(
    new SimpleReactValidator({
      className: "errorMessage",
    }),
  );

  const changeHandler = (e) => {
    setForms({ ...forms, [e.target.name]: e.target.value });

    if (validator.allValid()) {
      validator.hideMessages();
    } else {
      validator.showMessages();
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      validator.hideMessages();

      setForms({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      });

      setSuccessMsg("Thank you! Your message has been sent successfully.");

      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      validator.showMessages();
    }
  };

  return (
    <form onSubmit={submitHandler} className="contact-validation-active">
      <div className="row">
        <div className="col col-lg-6 col-12">
          <div className="form-field">
            <input
              value={forms.name}
              type="text"
              name="name"
              onBlur={changeHandler}
              onChange={changeHandler}
              placeholder="Your Name"
            />
            {validator.message("name", forms.name, "required|alpha_space")}
          </div>
        </div>

        <div className="col col-lg-6 col-12">
          <div className="form-field">
            <input
              value={forms.email}
              type="email"
              name="email"
              onBlur={changeHandler}
              onChange={changeHandler}
              placeholder="Your Email"
            />
            {validator.message("email", forms.email, "required|email")}
          </div>
        </div>

        <div className="col col-lg-6 col-12">
          <div className="form-field">
            <input
              value={forms.phone}
              type="text"
              name="phone"
              onBlur={changeHandler}
              onChange={changeHandler}
              placeholder="Your Phone"
            />
            {validator.message("phone", forms.phone, "required|phone")}
          </div>
        </div>

        <div className="col col-lg-6 col-12">
          <div className="form-field">
            <select
              value={forms.subject}
              name="subject"
              onBlur={changeHandler}
              onChange={changeHandler}
            >
              <option value="">Choose a Service</option>
              <option value="Room Service">Room Service</option>
              <option value="Luxury Resort">Luxury Resort</option>
              <option value="Help Center">Help Center</option>
            </select>
            {validator.message("subject", forms.subject, "required")}
          </div>
        </div>

        <div className="col col-lg-12 col-12">
          <div className="form-field">
            <textarea
              value={forms.message}
              name="message"
              placeholder="Message"
              onBlur={changeHandler}
              onChange={changeHandler}
            ></textarea>
            {validator.message("message", forms.message, "required")}
          </div>
        </div>
      </div>

      <div className="submit-area">
        <button type="submit" className="theme-btn">
          Submit Now
        </button>
      </div>

      {successMsg && <p className="successMessage">{successMsg}</p>}
    </form>
  );
};

export default ContactForm;
