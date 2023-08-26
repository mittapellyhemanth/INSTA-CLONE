import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from "../LayoutsPage/LandingPage/LandingPage";
import PostView from "../LayoutsPage/PostView_Page/PostView";
import NewPost from "../LayoutsPage/NewPost/NewPost";

export default function InstaCloneRouters(){
    return<>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/post/new" element={<NewPost/>} />
        <Route path="/post/view" element={<PostView/>} />
    </Routes>
    </BrowserRouter>
    </>
}



