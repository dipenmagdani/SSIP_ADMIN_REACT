import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from 'src/views/forms/validation/store';
import axios from 'axios';
import base_url from 'src/base_url';
import { jwtDecode } from "jwt-decode";
import expireToken from 'src/global_function/unauthorizedToken';
import LoadingBar from 'react-top-loading-bar';
import useAPI from 'src/global_function/useApi';

const DefaultLayout = () => {
  const [StoredTokens, CallAPI] = useAPI()
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken , refreshToken} = state
  const [_404,set404] = useState(true)
  const [accessTokenValid,setAccessTokenValid] = useState(false)
  const [progress,setProgress] = useState(0);  
  if (typeof window !== 'undefined') {
    window.setProgress = setProgress;
  }

  const checkAccessTokenAuthenticity = async () => {
    const headers = {
      "Content-Type":"application/json",      
      'ngrok-skip-browser-warning':true
    }
    const method = 'get'  
    const axiosInstance = axios.create()
    let endpoint = `/check_token_authenticity/`    
    let response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, headers)
    if (response_obj.error == false) {
      setAccessTokenValid(true)            
    } else {
      expireToken(refreshToken,setAccessTokenValid)
    }    
  }
  const navigate = useNavigate();  
  const checkServerAvaibility = async ()=> {
      const headers = {
        "Content-Type":"application/json",      
        'ngrok-skip-browser-warning':true
      }
      const method = 'get'
      const axiosInstance = axios.create()
      let endpoint = `/check_server_avaibility/`    
      let response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, headers)    
      if (response_obj.error == false) {
        set404(false)
      } else {
        navigate("/404")
      }
  }

  const decodeToken= () => {
    // console.log(accessToken,"decode")
    const decoded = jwtDecode(accessToken); 
    // console.log("decode",decoded)
    // if (typeof window !== 'undefined') {      
        // window.user_profile = decoded.obj.profile;
    // }
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
