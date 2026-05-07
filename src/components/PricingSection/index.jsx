import React from 'react'
import { Link } from 'react-router-dom'
import PrImg1 from '../../images/pricing/1.jpg'
import PrImg2 from '../../images/pricing/2.jpg';
import PrImg3 from '../../images/pricing/3.jpg'
import SectionTitleS2 from '../SectionTitleS2'


const Pricing = [
    {
        prImg: PrImg1,
        pakage: 'Basic Package',
        price: '250',
        subs: 'Night',
        l1: 'Altime Free Wifi',
        l2: '2 People Breakfast',
        l3: '1 Bed Room',
        l4: '2 People in Room'
    },
    {
        prImg: PrImg2,
        pakage: 'Standard Package',
        price: '450',
        subs: 'Night',
        l1: 'Altime Free Wifi',
        l2: '2 People Breakfast',
        l3: '1 Bed Room',
        l4: '2 People in Room'
    },
    {
        prImg: PrImg3,
        pakage: 'Luxary Package',
        price: '650',
        subs: 'Night',
        l1: 'Altime Free Wifi',
        l2: '2 People Breakfast',
        l3: '1 Bed Room',
        l4: '2 People in Room'
    },
]

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const PricingSection = (props) => {

    return (
        <section className="wpo-pricing-section section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6">
                        <SectionTitleS2 MainTitle={'Our Awesome Packages'} />
                    </div>
                </div>
                <div className="wpo-pricing-wrap">
                    <div className="row">
                        {Pricing.map((pricing, pitem) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={pitem}>
                                <div className="wpo-pricing-item">
                                    <div className="wpo-pricing-top">
                                        <div className="wpo-pricing-img">
                                            <img src={pricing.prImg} alt="" />
                                        </div>
                                        <div className="wpo-pricing-text">
                                            <h4>{pricing.pakage}</h4>
                                            <h2>${pricing.price}<span>/Per {pricing.subs}</span></h2>
                                        </div>
                                    </div>
                                    <div className="wpo-pricing-bottom">
                                        <div className="wpo-pricing-bottom-text">
                                            <ul>
                                                <li>{pricing.l1}</li>
                                                <li>{pricing.l2}</li>
                                                <li>{pricing.l4}</li>
                                                <li>{pricing.l3}</li>
                                            </ul>
                                            <Link onClick={ClickHandler} className="theme-btn" to="/search-result">Book Rooms</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

    )
}

export default PricingSection;