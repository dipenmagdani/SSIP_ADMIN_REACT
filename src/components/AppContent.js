import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import axios from 'axios'
import base_url from 'src/base_url'
import { useContext } from 'react'
import { Store } from 'src/views/forms/validation/store'
import { jwtDecode } from "jwt-decode";

// routes config
import routes from '../routes'

const AppContent = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { accessToken, refreshToken, batches } = state    

    const decodeToken= () => {
      const decoded = jwtDecode(accessToken);
      ctxDispatch({ type: 'SET_PROFILE', payload: decoded.profile});        
    }
    const loadBatches = async() => {
      const header = {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning':true
      }
      
      axios.get(`${base_url}/manage/get_batches`,{headers:header})
      .then((response)=>{
        ctxDispatch({ type: 'GET_BATCHES', payload: response.data.data });
        //console.log(state.batches);
        response.data.data.map((item) => {
          if(item.active){
            ctxDispatch({ type: 'CURRENT_BATCH_SLUG', payload: item });
          }
        })        
      })
      .catch((error)=>{
          if(error.response.status === 401){
            expireToken(refreshToken,(error,result)=>{
              ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.access });
              ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.refresh });
            })
          }
      })
    }
    useEffect(() => {
      if(accessToken){
        decodeToken()
        loadBatches()
      }
    }, []);
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
