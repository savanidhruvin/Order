import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {

const [open, setOpen] = useState(false);

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
