import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from 'src/views/forms/validation/store';

const DefaultLayout = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken , profileDetails } = state
  const navigate = useNavigate();  
   useEffect(() => {
    if(!accessToken){
      navigate("/login")
    }    
  }, []);  
  
  if(accessToken){
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
