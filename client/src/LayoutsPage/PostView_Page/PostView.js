import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";

import Heart from "../../ImageIcons/heart.png";
import Share from "../../ImageIcons/share.png";
import axios from "axios";
import "./PostView.css";

export default function PostView() {
  const [getData, setGetData] = useState({ result: [] });
  useEffect(() => {
    console.log(`${process.env.REACT_PROXY_URL}/getPost`);
    axios
      .get(`${process.env.REACT_APP_PROXY_URL}/getPost`)
      .then((res) => {
        setGetData(res.data);
       
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div>
        {getData.result.length === 0 ? (
          <p key={"ke"}>Loading...</p>
        ) : (
          getData.result.map((post,i) => (
           <div className="card-container" key={i}>
              <div className="header mg-y" >
                <div > 
                   <div><strong >{post.name}</strong></div>
                   <div className="location">{post.location}</div>
                </div>
                
                <div>
                  <span className="mg-x">&#9679;&#9679;&#9679;</span>
                </div>
              </div>
              <div className="img">
                 <img src={`/uploads/${post.PostImage}`} alt="user-img" />
              </div>

              <div className="footer mg-l">
                <div className="footer-left">
                  <img src={Heart} alt="heart-img" className="Heart" />
                  <img src={Share} alt="share-img" className="Share" />
                  <p>likes</p>
                  {/* <p>{post.likes}</p> */}
                </div>
              <span className="mg-x">{post.date}</span>
             </div>
              <div className="description mg-l">
                <div><strong>{post.description}</strong></div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
