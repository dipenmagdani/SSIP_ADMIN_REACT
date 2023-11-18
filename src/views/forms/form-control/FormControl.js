import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Store } from '../validation/store'
import {base_url} from "src/base_url"
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
} from '@coreui/react'

const CustomStyles = () => {
  const [validated, setValidated] = useState(false)
  
  const [Snumber, setSnumber] = useState("");
  const [Sstatus, setSstatus] = useState("");
  const [Ssdate, setSsdate] = useState("");
  const [Sedate, setSedate] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo , semesters } = state
  const [Semesters, setSemesters] = useState(semesters);

  const token = localStorage.getItem('accessToken')
  
  // function to load semester
  const load_sem = async() =>{
      const headers = {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      };
      axios.get(`${base_url}/manage/get_semester/`,{headers})
      .then((response)=>{
        console.log(response);
      })
      .catch((error)=>{
        console.log(error);
      })
  }
  //function to add sem

  const add_sem = async (body) => {
    const headers = {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`, 
    };

    axios.post(`${base_url}/manage/add_semeseter/`,body,{headers})
    .then((response)=>{
      console.log(response);
    })
    .catch((error)=>{
      console.log(error);
    })
  }





  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    // console.log(Snumber);
    // console.log(Sstatus);
    // console.log(Ssdate);
    // console.log(Sedate);
    setValidated(true)
    const body = {
      semester_number: Snumber,
      start_date: Ssdate,
      end_date: Sedate
    }
    console.log(body);
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Semester Number</CFormLabel>
        <CFormInput type="number" id="validationCustom01" onChange={e => setSnumber(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Term Status</CFormLabel>
        <CFormSelect onChange={e => setSstatus(e.target.value)}>
          <option value="odd">Odd</option>
          <option value="Even">Even</option>
        </CFormSelect>
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
        <CButton color="primary" type="submit">
          Submit form
        </CButton>
      </CCol>
    </CForm>
  )
}

const FormControl = () => {
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Semesters</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles()}</CCardBody>
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
                  <CTableRow>
                    <CTableHeaderCell>Semester</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Term Start Date</CTableHeaderCell>
                    <CTableHeaderCell>Term End Date</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton style={{ marginRight: '10px' }}>View Details</CButton>
                        <CButton>Add Semester</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))} */}
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
  nextForm: PropTypes.func.isRequired,
}
export default FormControl
