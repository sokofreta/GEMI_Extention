import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faBriefcase,faTrowel, faUserGear } from '@fortawesome/free-solid-svg-icons';
import "./Navbar.css"

const Navbar = () => {
  const NAVIGATE = useNavigate();

  const [isHover, SetisHover] = useState(false)


  return (
    <div className='Navbar' onMouseOver={() => { SetisHover(true) }} onMouseOut={() => { SetisHover(false) }} >
      <div className='Logo'>
        <p>LOGO</p>
      </div>
      
      <div className='NavLinkCon'>
        <button className="Navlink" onClick={() => { NAVIGATE("/") }}>
          <FontAwesomeIcon icon={faHouse} size='2xl' />
        </button>
        {isHover ? <p>Αρχικη</p> : ""}
      </div>

      <div className='NavLinkCon'>
        <button className="Navlink" onClick={() => { NAVIGATE("/Scrapper") }}>
          <FontAwesomeIcon icon={faTrowel} size='2xl' />
        </button>
        {isHover ? <p>Scrapper</p> : ""}
      </div>


      <div className='NavLinkCon'>
        <button className="Navlink" onClick={() => { NAVIGATE("/Bussineses") }}>
          <FontAwesomeIcon icon={faBriefcase} size='2xl' />
        </button>
        {isHover ? <p>Επιχειρήσεις</p> : ""}
      </div>


      <div className='NavLinkCon'>
        <button className="Navlink" onClick={() => { NAVIGATE("/Profile") }}>
          <FontAwesomeIcon icon={faUserGear} size='2xl' />
        </button>
        {isHover ? <p>Προφιλ</p> : ""}
      </div>



    </div>
    // <div className='Navbar'>
    //   <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/")}}> ΑΡΧΙΚΗ ΣΕΛΙΔΑ</Button>
    //   <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/Scrapper")}}>Scrapper</Button>
    //   <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/Bussineses")}}>ΕΠΙΧΕΙΡΗΣΕΙΣ</Button>
    //   <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/Register")}}>Συνδεση/Εγγραφη</Button>
    //   <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/Profile")}}>Προφιλ</Button>

    // </div>
  )
}

export default Navbar
