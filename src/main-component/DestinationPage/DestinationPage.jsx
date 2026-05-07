import React, {Fragment} from 'react';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar';
import Logo from '../../images/logo2.png'
import Footer from '../../components/footer'
import Scrollbar from '../../components/scrollbar'
import Destination2 from '../../components/Destination2';
import Newslatter from '../../components/Newslatter/Newslatter';

const DestinationPage =() => {
    return(
        <Fragment>
            <Navbar hclass={'wpo-header-style-3'} Logo={Logo} />
            <PageTitle pageTitle={'Destinations'} /> 
            <Destination2/>
            <Newslatter nClass={'section-bg'}/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default DestinationPage;
