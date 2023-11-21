import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from 'src/views/forms/validation/store';
import axios from 'axios';
import base_url from 'src/base_url';

const DefaultLayout = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken , profileDetails} = state
  const [_404,set404] = useState(true)

  const navigate = useNavigate();  
  const checkServerAvaibility = ()=> {
    const header = {
      "Content-Type":"application/json",      
      'ngrok-skip-browser-warning':true
    }
    
    axios.get(`${base_url}/check_server_avaibility/`,{headers:header})
    .then((response)=>{
      set404(false) 
      console.log(response.data)
    })
    .catch((error)=>{             
      navigate("/404")
    })
  }
  useEffect(() => {
    if(_404){      
      checkServerAvaibility()
    }
  },[_404])
   useEffect(() => {
    if(!accessToken){
        navigate("/login")
    }    
  }, []);  
  
  if(accessToken && !_404){
    return (    
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>    
  )
  }else{
    return null
  }
}

export default DefaultLayout
