import React, {Fragment} from 'react';
import About from '../../components/about';
import Destination from '../../components/Destination';
import Footer from '../../components/footer';
import FunFact from '../../components/FunFact';
import Hero from '../../components/hero';
import Navbar from '../../components/Navbar'
import Newslatter from '../../components/Newslatter/Newslatter';
import PricingSection from '../../components/PricingSection';
import Rooms from '../../components/Rooms/Rooms';
import Scrollbar from '../../components/scrollbar'
import SearchSection from '../../components/SearchSection';
import Logo from '../../images/logo.png'



const HomePage =() => {

    return(
        <Fragment>
            <Navbar topbarBlock="wpo-header-style-2" hclass="wpo-header-style-2" Logo={Logo} /> 
            <Hero/> 
            <SearchSection/> 
            <Rooms/> 
            <About/> 
            <FunFact fClass={'wpo-fun-fact-section-s2 section-padding'}/> 
            <Destination/> 
            <PricingSection/> 
            <Newslatter/> 
            <Footer/> 
            <Scrollbar/>
        </Fragment>
    )
};

export default HomePage;