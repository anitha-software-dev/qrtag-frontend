import React from 'react';
import Header1 from '../Components/Header/Header1';
import Footer2 from '../Components/Footer/Footer2';


const DefalultLayout = ({ children }) => {
    return (
        <div className='main-page-area'>
            <Header1></Header1>
            {children}
            <Footer2></Footer2>
        </div>
    );
};

export default DefalultLayout;