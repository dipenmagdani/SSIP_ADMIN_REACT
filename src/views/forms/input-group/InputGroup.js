import React from 'react'
import { useState , useContext,useEffect } from 'react'
import PropTypes from 'prop-types'
import { Store } from '../validation/store'
import axios from 'axios'
import base_url from 'src/base_url'
import expireToken from 'src/global_function/unauthorizedToken'
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
  CTableDataCell,
} from '@coreui/react'

const CustomStyles = (semSlug,setsubjects) => {
  const [validated, setValidated] = useState(false)
  const [SName, setSName] = useState("");
  const [Scode, setScode] = useState("");
  const [Scredit, setScredit] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, objectCount } = state
  
  const add_subject = async (body) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'ngrok-skip-browser-warning': true
    };

    axios.post(`${base_url}/manage/add_subjects`, body, { headers })
      .then((response) => {
          let changeSubjectCount = {...objectCount}
          changeSubjectCount.subjects += 1
          console.log(changeSubjectCount);
          ctxDispatch({ type: 'GET_OBJECTS', payload: changeSubjectCount })
          setsubjects(prevArray => [...prevArray, response.data.subject])
      })
      .catch((error) => {
        if(error.response.status === 401){
          expireToken(refreshToken,(error,result)=>{
            ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.data.access });
            ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.data.refresh });
          })
        }
        console.log(error);
        alert(error.response.data.data)
      })
  }
  
  
  
  
  
  
  
  
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    console.log(SName)
    console.log(Scode)
    console.log(Scredit);
    setValidated(true)
    const body = {
      semester_slug:semSlug,
      subject_name:SName,
      subject_code:Scode,
      subject_credit:Scredit
    }
    event.preventDefault()
    add_subject(body)
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Subject Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" onChange={e => setSName(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Subject Code</CFormLabel>
        <CFormInput type="text" id="validationCustom02" onChange={e => setScode(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom02">Subject Credit</CFormLabel>
        <CFormInput type="text" id="validationCustom02" onChange={e => setScredit(e.target.value)} required />
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

const Select = (props) => {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, semesters } = state

  const {semSlug , chageSteps} = props
  console.log(semSlug);
  const [subjects, setsubjects] = useState([]);
  
  const load_subjects = async () => {
    const header = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'ngrok-skip-browser-warning': true
    }

    axios.get(`${base_url}/manage/get_subjects`, {
      params: { semester_slug: semSlug },
      headers: header
    })
      .then((response) => {
        console.log(response.data.data);
        setsubjects(response.data.data)
        
      })
      .catch((error) => {
        if(error.response.status === 401){
          expireToken(refreshToken,(error,result)=>{
            ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.access });
            ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.refresh });
          })
        }
      }) 
  }

  useEffect(() => {
      load_subjects()
  }, []);
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Subjects</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(semSlug,setsubjects)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Subjects History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Subject Name</CTableHeaderCell>
                    <CTableHeaderCell>Subject Code</CTableHeaderCell>
                    <CTableHeaderCell>Subject Credit</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {subjects.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.subject_name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.code}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.credit}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
Select.prototype = {
  chageSteps:PropTypes.func.isRequired,
  semSlug: PropTypes.string
}
export default Select
