import React from "react";
import { Link } from "react-router-dom";
import home from '../../ImageIcons/home.png'

import './Landing.css'

export default function LandingPage(){
    return <>
    <div className="landing-card">
<div className="landing-container">
     <div className="img-container">
    <img src={home} alt="logo"/>
    </div>
    <div className="text-container">
    <h3 className="text-style">10x Team 04</h3>
    <Link to='/post/view'><button className="btn-style">Enter</button></Link>
</div>
</div>
    </div>
    </>
}


