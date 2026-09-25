import React from 'react';
import HeroBanner1 from '../Components/HeroBanner/HeroBanner1';
import About1 from '../Components/About/About1';
import Features1 from '../Components/Features/Features1';
import HowWeDo1 from '../Components/HowWeDo/HowWeDo1';
import Process1 from '../Components/Process/Process1';
import Benefits from '../Components/Benefits/Benefits1';
import Project2 from '../Components/Project/Project2';
import Pricing1 from '../Components/Pricing/Pricing1';
import Faq1 from '../Components/Faq/Faq1';
import Contact1 from '../Components/Contact/Contact1';
import Blog3 from '../Components/Blog/Blog3';
import Downloads1 from '../Components/Downloads/Downloads1'

const page = () => {
    return (
        <div>
            <HeroBanner1></HeroBanner1>
            <About1></About1>
            <Features1></Features1>
            <HowWeDo1></HowWeDo1>
            <Benefits></Benefits>
            <Project2></Project2>
            <Process1></Process1>
            <Pricing1></Pricing1>
            <Faq1></Faq1>
            <Downloads1></Downloads1>
            <Blog3></Blog3>
            <Contact1></Contact1>
        </div>
    );
};

export default page;