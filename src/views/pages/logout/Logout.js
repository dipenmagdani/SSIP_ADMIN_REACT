import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from 'src/views/forms/validation/store';

const Logout = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { accessToken , refreshToken , profileDetails, objectCount} = state  
    
    const navigate = useNavigate()
    ctxDispatch({ type: 'ACCESS_TOKEN', payload: null });
    ctxDispatch({ type: 'REFRESH_TOKEN', payload: null });
    useEffect(()=>{
        localStorage.clear()
        navigate("/login")
    },[])
  return (
    null
  );
}

export default Logout;
