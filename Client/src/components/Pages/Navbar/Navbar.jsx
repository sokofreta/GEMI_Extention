import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear } from '@fortawesome/free-solid-svg-icons';
import "./Navbar.css"

const Navbar = () => {
  const NAVIGATE = useNavigate();


  return (
    <div className='Navbar'>


      <div className='NavLinkCon'>
        <button className="Navlink" onClick={() => { NAVIGATE("/") }}>
          {/* <FontAwesomeIcon icon={faHouse} size='2xl' /> */}
          Αρχική σελίδα
        </button>

      </div>

      {/* <div className='NavbarSep'>
        
      </div> */}
      <div className='NavLinkCon'>
        <button className="Navlink" onClick={() => { NAVIGATE("/Scrapper") }}>
          {/* <FontAwesomeIcon icon={faTrowel} size='2xl' /> */}
          Scrapper
        </button>

      </div>


      <div className='NavLinkCon'>
        <button className="Navlink" onClick={() => { NAVIGATE("/Bussineses") }}>
          {/* <FontAwesomeIcon icon={faBriefcase} size='2xl' /> */}
          Επιχειρήσεις
        </button>

      </div>


      <div className="NavLinkCon">
        <button className="UserProfile " onClick={() => { NAVIGATE("/Profile") }}>
          <FontAwesomeIcon icon={faUserGear} size='2xl' />
        </button>
      </div>




    </div>
  )
}

export default Navbar
