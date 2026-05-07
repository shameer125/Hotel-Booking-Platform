import React, {Fragment} from 'react';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footer'
import Scrollbar from '../../components/scrollbar'
import Logo from '../../images/logo2.png'
import Rooms2 from '../../components/Rooms2/Rooms2';
import Newslatter from '../../components/Newslatter/Newslatter';

const RoomPage =() => {
    return(
        <Fragment>
            <Navbar hclass={'wpo-header-style-3'} Logo={Logo} />
            <PageTitle pageTitle={'Room'} /> 
            <Rooms2/>
            <Newslatter/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};

export default RoomPage;
