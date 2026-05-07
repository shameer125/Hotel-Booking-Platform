import React, { Fragment, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PageTitle from "../../components/pagetitle/PageTitle";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";
import Scrollbar from "../../components/scrollbar";
import Logo from "../../images/logo2.png";
import Services from "../../api/service";

const ServiceSinglePage = () => {
  const { serviceId } = useParams();
  const service = useMemo(
    () => Services.find((s) => String(s.id) === String(serviceId)),
    [serviceId]
  );

  const ClickHandler = () => window.scrollTo(10, 0);

  if (!service) {
    return (
      <Fragment>
        <Navbar hclass={"wpo-header-style-3"} Logo={Logo} />
        <PageTitle pageTitle={"Service not found"} />
        <section className="service-single-section section-padding">
          <div className="container text-center">
            <p className="mb-4">This service could not be found.</p>
            <Link to="/service" className="theme-btn" onClick={ClickHandler}>
              All services
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
      <PageTitle pageTitle={service.title} />
      <section className="service-single-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="service-single-content">
                <div className="service-single-img">
                  <img src={service.ssImg} alt={service.title} />
                </div>
                <p className="lead">{service.description}</p>
                <p>
                  Enjoy this amenity throughout your stay. Our team keeps
                  everything maintained so you can relax from arrival to
                  departure.
                </p>
                <Link to="/service" className="theme-btn" onClick={ClickHandler}>
                  Back to services
                </Link>
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

export default ServiceSinglePage;
