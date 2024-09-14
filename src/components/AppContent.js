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
  const navigate = useNavigate();

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
    }
  }, []);
  return (
    <>
    
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
            
            {
              (() => {
                if (profileDetails.obj.profile.role === "superadmin") {
                  return <Route path="/" element={<Navigate to="superadmin" replace />} />;
                }
                else if (profileDetails.obj.profile.role === "admin") {
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
      </CContainer>
    </>
  )
}

export default React.memo(AppContent)
