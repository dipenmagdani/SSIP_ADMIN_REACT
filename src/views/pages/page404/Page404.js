import {React, useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import base_url from 'src/base_url'
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'

const Page404 = () => {

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
      navigate('/')
    })
    .catch((error)=>{             
      navigate("/404")
    })
  }
  useEffect(() => {
    if(_404){      
      checkServerAvaibility()
    }
  },[])

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
              <p className="text-medium-emphasis float-start">
                The page you are looking for was not found.
              </p>
            </div>
            <CInputGroup className="input-prepend">
              <CInputGroupText>
                <CIcon icon={cilMagnifyingGlass} />
              </CInputGroupText>
              <CFormInput type="text" placeholder="What are you looking for?" />
              <CButton color="info">Search</CButton>
            </CInputGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
