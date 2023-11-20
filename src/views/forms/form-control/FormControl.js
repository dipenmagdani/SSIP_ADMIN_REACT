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

const CustomStyles = (Semesters, setSemesters, batchSlug) => {
  const [validated, setValidated] = useState(false)

  const [Snumber, setSnumber] = useState("");
  const [Sstatus, setSstatus] = useState("");
  const [Ssdate, setSsdate] = useState("");
  const [Sedate, setSedate] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, semesters , objectCount } = state
  const [semCount, setsemCount] = useState(objectCount);





  const add_sem = async (body) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    axios.post(`${base_url}/manage/add_semester`, body, { headers })
      .then((response) => {
        console.log(response.data.data);
        let changeCount = {...objectCount}
        changeCount.semesters += 1
        console.log(changeCount);
        ctxDispatch({ type: 'GET_OBJECTS', payload: changeCount });
        if(response.data.data.status)
        {
          setSemesters(prevArray => [...prevArray, response.data.data])
        }
        
      })
      .catch((error) => {
        if(error.response.status === 401){
          expireToken(refreshToken,(error,result)=>{
            ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.access });
            ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.refresh });
          })
        }
        alert(error.response.data.data)
      })
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
      batch_slug: batchSlug,
      semester_number: Snumber,
      start_date: Ssdate,
      end_date: Sedate
    }
    add_sem(body);
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Semester Number</CFormLabel>
        <CFormInput type="number" id="validationCustom01" onChange={e => setSnumber(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom02">Term Start Date</CFormLabel>
        <CFormInput type="date" id="validationCustom02" onChange={e => setSsdate(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom02">Term End Date</CFormLabel>
        <CFormInput type="date" id="validationCustom02" onChange={e => setSedate(e.target.value)} required />
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
  const { batchSlug ,chageSteps , setsemSlug } = props
  const [Semesters, setSemesters] = useState([]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, semesters } = state

  const load_sem = async () => {
    console.log(batchSlug);
    console.log(accessToken);
    const header = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'ngrok-skip-browser-warning': true
    }

    axios.get(`${base_url}/manage/get_semesters`, {
      params: { batch_slug: batchSlug },
      headers: header
    })
      .then((response) => {
        setSemesters(response.data.data)
        console.log(response.data.data);
        console.log(Semesters);
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
    load_sem()
  }, [accessToken]);


  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Semesters</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(Semesters, setSemesters, batchSlug)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Semester History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow onClick={() => {chageSteps('subject');}}>
                    <CTableHeaderCell>Semester</CTableHeaderCell>
                    <CTableHeaderCell>Term Start Date</CTableHeaderCell>
                    <CTableHeaderCell>Term End Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Semesters.map((item, index) => (
                    item.status ? (
                      <CTableRow key={index} onClick={() => {chageSteps('subject'); setsemSlug(item.slug);}}>
                        <CTableDataCell>
                          <div>{item.no}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.start_date}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.end_date}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : null
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

FormControl.propTypes = {
  chageSteps:PropTypes.func.isRequired,
  setsemSlug:PropTypes.func.isRequired,
  batchSlug: PropTypes.string
}
export default FormControl
