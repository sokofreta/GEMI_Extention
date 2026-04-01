import React from 'react'
import { Button } from '@mui/material'
import {useNavigate } from 'react-router-dom'
import "./TestingRoutes.css"

const TestingRoutes = () => {
    const NAVIGATE = useNavigate();
  return (
    <div id='options'>
      <Button variant='outlined' color='primary' onClick={() => {NAVIGATE("/")}}> Go to index</Button>
      <Button variant='outlined' color='Secondary' onClick={() => {NAVIGATE("/Home")}}> Go to Home</Button>
      <Button variant='outlined' color='sucess' onClick={() => {NAVIGATE("/Scrapper")}}> Go to Scrapper</Button>
      <Button variant='outlined' color='error' onClick={() => {NAVIGATE("/Bussineses")}}> Go to Bussineses</Button>
    </div>
  )
}

export default TestingRoutes
