import React, { cache, useEffect, useLayoutEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import axios from 'axios';
const Base = "http://localhost:5000/api"

const Layout = () => {

const [open, setOpen] = useState(false);

useLayoutEffect(()=>{
   const TokenApi = async() => {
      try {
          const response = await axios.get(`${Base}/getToken`)
          console.log(response);
          localStorage.setItem("Token" , response?.data?.data)     
      }catch(error){
           
      }
   }
   TokenApi()
},[])

  return (
    <div>
       <div className='flex'>
           <Sidebar open={open} setOpen={setOpen}/>
           <div className='w-full'>
              <Outlet/>
           </div>
       </div>
    </div>
  )
}

export default Layout
