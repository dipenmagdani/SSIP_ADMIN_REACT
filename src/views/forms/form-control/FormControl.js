import React from 'react'
import { useState, useEffect } from 'react'
import { useContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Store } from '../validation/store'
import base_url from 'src/base_url'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CTableDataCell
} from '@coreui/react'
import expireToken from 'src/global_function/unauthorizedToken'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
import { useNavigate } from 'react-router-dom'
import { showAlert } from 'src/global_function/GlobalFunctions'

const CustomStyles = (set_divisions, semester_slug) => {
  const [validated, setValidated] = useState(false)
  const [division_name, set_division_name] = useState("")
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, semesters , objectCount } = state
  const [semCount, setsemCount] = useState(objectCount);
  const navigate = useNavigate()




  const add_division = async (body) => {
    const header = {
      "Content-Type":"application/json",      
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/add_semester`;let method='post';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,body,null)
    if(response_obj.error == false){
      let response = response_obj.response
      let changeCount = {...objectCount}
      changeCount.semesters += 1
      console.log(changeCount);
      ctxDispatch({ type: 'GET_OBJECTS', payload: changeCount });
      if(response.data.data.status)
      {
        set_divisions(prevArray => [...prevArray, response.data.data])
      }
    }else{  
      console.log(response_obj.error)
    }    
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    event.preventDefault()
    setValidated(true)
    const body = {
      semester_slug: semester_slug,
      division_name: division_name,
    }
    add_division(body);
    showAlert("success","Semester Added successfully...!")
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Division Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" onChange={e => set_division_name(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>      
      <CCol xs={12}>
        <button className='btn btn-outline-dark form-control' type="submit">
          Submit form
        </button>
      </CCol>
    </CForm>
  )
}

const FormControl = (props) => {
  const { semester_slug ,chageSteps , setsemSlug } = props
  const [divisions, set_divisions] = useState([]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, semesters } = state
  const navigate = useNavigate()
  const load_division = async () => {    
    const header = {
      "Content-Type":"application/json",        
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_semesters`;let method='get';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,null,{semester_slug: semester_slug })
    if(response_obj.error == false){
      let response = response_obj.response      
        set_divisions(response.data.data)
        console.log(response.data.data);
    }else{  
      console.log(response_obj.error)
    }
  }

  useEffect(() => {
    load_division()
  }, []);


  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Semesters</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(set_divisions, semester_slug)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Division History</strong>
            </CCardHeader>
            <CCardBody>
              {/* <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow onClick={() => {chageSteps('batch');}} style={{textAlign:"center"}}>
                    <CTableHeaderCell>Semester</CTableHeaderCell>
                    <CTableHeaderCell>Activation Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody style={{textAlign:"center"}}>
                  {divisions.map((item, index) => (
                    item.status ? (
                      <CTableRow key={index} onClick={() => {chageSteps('batch'); setsemSlug(item.slug);}}>
                        <CTableDataCell>
                          <div>{item.no}</div>
                        </CTableDataCell>
                         <CTableDataCell>
                          <div>{item.status ? (<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                          </svg>{}
                          </div>):(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                          </svg>)}</div>
                        </CTableDataCell>
                        
                      </CTableRow>
                    ) : null
                  ))}
                </CTableBody>

              </CTable> */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

FormControl.propTypes = {
  chageSteps:PropTypes.func.isRequired,
  setsemSlug:PropTypes.func.isRequired,
  batchSlug: PropTypes.string
}
export default FormControl
