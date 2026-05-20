import React from 'react'
import { Button } from '@mui/material'
import {useNavigate } from 'react-router-dom'
import "./Navbar.css"

const Navbar = () => {
    const NAVIGATE = useNavigate();
  return (
    <div className='Navbar'>
      <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/")}}> Go to index</Button>
      <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/Home")}}> Go to Home</Button>
      <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/Scrapper")}}> Go to Scrapper</Button>
      <Button variant='outlined' id="Navlink" onClick={() => {NAVIGATE("/Bussineses")}}> Go to Bussineses</Button>
    </div>
  )
}

export default Navbar
 