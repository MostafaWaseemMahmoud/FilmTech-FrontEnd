import { useNavigate } from 'react-router-dom';
import './welcome.css';

function WelcomePage() {
  const navigate = useNavigate()
  return (
    <div className='Welcome'>
      <div className='my-header'>
        <div className="logo">
          <img className='header-logo' src="./FILM TECH lOGO.png" alt="The Logo"/>
          <h1>Film-Tech</h1>
          </div>
        <div className="s-button">
          <button onClick={()=>{navigate("/join")}}>Join Us</button>
          </div>
      </div>

      <div className="my-main">
        <div className="logo">
          <img class="moreWidth" src="./FILM TECH lOGO.png" alt="The Logo"/>
          </div>
          <div className="txt">
        <h1>Welcome! To FilmTech</h1>
        <h2>Film Tech Is Community For People Who  Watches And Loves Movies And Series</h2>
        <h4>Here You Can Share You Opinion Of A Movie Or Series You Have Watched, You Can Share Your Opinion About Any Actor Too</h4>
        <p>Made By <a href="https://mstw-portofolio.netlify.app">Mostafa Waseem</a></p>
          </div>
      </div>
    </div>
  )
}

export default WelcomePage
