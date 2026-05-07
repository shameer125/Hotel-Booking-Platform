import React from 'react';
import { Link } from 'react-router-dom'
import Destinations from '../../api/destination'



const Destination2 = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="wpo-destination-area pt-120">
            <div className="container">
                <div className="destination-wrap">
                    <div className="row">
                        {Destinations.slice(0, 6).map((destination, ditem) => (
                            <div className="col-lg-4 col-md-6 col-12" key={ditem}>
                                <div className="destination-item">
                                    <div className="destination-img">
                                        <img src={destination.dimg1} alt=""/>
                                    </div>
                                    <div className="destination-content">
                                        <span className="sub">{destination.subTitle}</span>
                                        <h2>{destination.title}</h2>
                                        <div className="destination-bottom">
                                            <p>${destination.price} Per Night</p>
                                            <div className="destination-bottom-right">
                                                <ul>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><span><i className="fa fa-star" aria-hidden="true"></i></span></li>
                                                </ul>
                                                <small>4.5</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )

}

export default Destination2;
