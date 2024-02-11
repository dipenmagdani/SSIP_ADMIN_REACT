import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from 'src/views/forms/validation/store';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import expireToken from 'src/global_function/unauthorizedToken';
import LoadingBar from 'react-top-loading-bar';
import useAPI from 'src/global_function/useApi';
import { base_url } from 'src/base_url';

const DefaultLayout = () => {
  const [StoredTokens, CallAPI] = useAPI()
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken} = state
  const [_404,set404] = useState(true)
  const [accessTokenValid,setAccessTokenValid] = useState(false)
  const [progress,setProgress] = useState(0);  
  
  const navigate = useNavigate();  
  
  if (typeof window !== 'undefined') {
    window.setProgress = setProgress;
  }

  const checkAccessTokenAuthenticity = async () => {
    if(localStorage.getItem('accessToken')){
      const headers = {
        "Content-Type":"application/json",      
        'ngrok-skip-browser-warning':true,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
  
      axios.get(`${base_url}/check_token_authenticity/`,{headers:headers})
      .then((response)=>{
        if(response.data.data === true){
          setAccessTokenValid(true)            
        }
        else{
          expireToken(refreshToken,setAccessTokenValid)
        }
      })
      .catch((error)=>{
        alert(error.message)
      })
    }
      
  }
  const checkServerAvaibility = async ()=> {
    const headers = {
         "Content-Type":"application/json",      
         'ngrok-skip-browser-warning':true,
         
    }
    axios.get(`${base_url}/check_server_avaibility/`,{headers:headers})
    .then((response)=>{
        set404(false)
    })
    .catch((error)=>{
        navigate("/404")
    })
    
      
  }

  const decodeToken= () => {
    const decoded = jwtDecode(accessToken); 
    ctxDispatch({ type: 'SET_PROFILE', payload: decoded});    
  }
  
  useEffect(() => {
    if(_404){      
      checkServerAvaibility()
    }else{
        checkAccessTokenAuthenticity()
    }
  },[_404])

   useEffect(() => {
    if(!accessToken){
        navigate("/login")
    }
    else{      
      decodeToken()
    }    
  }, [accessToken]);    
  useEffect(() => {    
  },[accessTokenValid])
  if(accessToken && !_404 && accessTokenValid){
    return (    
      <div>
  <LoadingBar color={'#1f6feb'} progress={progress}
      onLoaderFinished={() => setProgress(0)} />
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter/>
        </div>
      </div>    
  )
  }else{
    return null
  }
}

export default DefaultLayout
