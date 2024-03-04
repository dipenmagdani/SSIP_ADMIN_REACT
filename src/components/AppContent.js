import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import axios from 'axios'
import {base_url} from 'src/base_url'
import { useContext } from 'react'
import { Store } from 'src/views/forms/validation/store'

import expireToken from 'src/global_function/unauthorizedToken'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'

// routes config
import routes from '../routes'
import { cilFace } from '@coreui/icons'

const AppContent = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken, refreshToken, batches, accessTokenActive, profileDetails } = state
  const [permission_state,set_permission_state] = useState(false)
  const navigate = useNavigate();

  const get_location_permission = () =>{
    if(navigator.geolocation){
      
        navigator.geolocation.getCurrentPosition((position)=>{
          set_permission_state(true)
        })
    }
    else{
      alert("please allow permission of location")
    }
  }

  const loadBatches = async () => {
    const header = {
      "Content-Type": "application/json",
      'ngrok-skip-browser-warning': true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_batches`; let method = 'get'; let headers = header;
    let response_obj = await APIMiddleware(axiosInstance, endpoint, method, headers)
    if (response_obj.error == false) {
      let response = response_obj.response
      ctxDispatch({ type: 'GET_BATCHES', payload: response.data.data });
      response.data.data.map((item) => {
        if (item.active) {
          ctxDispatch({ type: 'CURRENT_BATCH_SLUG', payload: item });
        }
      })
    } else {
      
    }
  }

  useEffect(() => {
    if (accessToken) {
      if (profileDetails.obj.profile.role === "admin") {
        // loadBatches()
      }
      if(profileDetails.obj.profile.role === "student"){
        get_location_permission()
      }
      if(profileDetails.obj.profile.role === "teacher"){
        get_location_permission()
      }
    }
  }, []);
  return (
    <>
    {
      permission_state ? (<CContainer lg>
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
            
            {
              (() => {
                if (profileDetails.obj.profile.role === "admin") {
                  return <Route path="/" element={<Navigate to="dashboard" replace />} />;
                } else if (profileDetails.obj.profile.role === "teacher") {
                  return <Route path="/" element={<Navigate to="teacher/dashboard" replace />} />;
                }
                else if (profileDetails.obj.profile.role === "student") {
  
                  return <Route path="/" element={<Navigate to="studentdashboard" replace />} />;
                }
              })()
            }
  
  
  
          </Routes>
        </Suspense>
      </CContainer>) : (
        <video src='/images/mobile.webm' autoPlay={false} controls={true} className='w-100 h-full'></video>
      )
    }
    
    </>
  )
}

export default React.memo(AppContent)
