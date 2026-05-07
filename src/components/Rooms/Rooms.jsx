import { Link } from "react-router-dom";
import SectionTitleS2 from "../SectionTitleS2";
import { useSelector } from "react-redux";
import { selectPublicRooms } from "../../store/selectors/roomsSelectors";

const Rooms = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const products = useSelector(selectPublicRooms);

  return (
    <div className="wpo-room-area section-padding">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-6 col-md-8">
            <SectionTitleS2 MainTitle={"Our Most Populer Room"} />
          </div>
        </div>
        <div className="room-wrap">
          <div className="row">
            {products.length > 0 &&
              products.slice(0, 3).map((product) => (
                <div className="col-lg-4 col-md-6 col-12" key={product.id}>
                  <div className="room-item">
                    <div className="room-img">
                      <img src={product.proImg} alt="" />
                    </div>
                    <div className="room-content">
                      <h2>
                        <Link
                          onClick={ClickHandler}
                          to={`/room-single/${product.id}`}
                        >
                          {product.title}
                        </Link>
                      </h2>
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
                      </ul>
                      <h3>
                        ${product.price} <span>/ Night</span>
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
