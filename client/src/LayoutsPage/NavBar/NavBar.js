import navLogo from '../../ImageIcons/icon.svg';
import cameraLogo from '../../ImageIcons/camera.png';

import './NavBar.css'
import { Link } from 'react-router-dom';


export default function NavBar(){
    return <>
   <nav className='Nav-container'>
   <div  className="nav-box">
            <div className='logo-container'>
         <img src={navLogo} alt="insta-logo" />
         <h2 className=' text'>Instaclone</h2>
            </div>
            <div className='camera-logo'>
           <Link to='/post/new'> <img src={cameraLogo} alt="insta-logo" className='camera-img'/> </Link>
            </div>
     
   </div>
        </nav>
    </>
}


