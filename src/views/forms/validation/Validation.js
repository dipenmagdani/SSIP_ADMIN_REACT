import React, { useState  } from 'react'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useContext } from 'react'
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
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cilGlobeAlt,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import { Store } from '../validation/store'
import base_url from 'src/base_url'




const CustomStyles = (Batches,setBatches,setBatchCout) => {
  const token = localStorage.getItem('accessToken')
  const [validated, setValidated] = useState(false)
  const [Start, setStart] = useState("");
  const [End, setEnd] = useState("");
  
  const addBatches = async(body) => {
    const headers = {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`,
      'ngrok-skip-browser-warning':true
    };
    axios.post(`${base_url}/manage/add_batch`,body,{headers})
    .then((response)=>{
      console.log(response.data.data);
      setBatches(prevArray => [...prevArray, response.data.data]);
      setBatchCout(preValue => preValue + 1);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    const body = {
      batch_name: Start + "-" + End
    }
    addBatches(body)
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Start Year</CFormLabel>
        <CFormInput type="text" id="validationCustom01" onChange={e => setStart(e.target.value)} required maxLength={4} />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom02">End Year</CFormLabel>
        <CFormInput type="text" id="validationCustom02" onChange={e => setEnd(e.target.value)}  required maxLength={4}/>
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit" >
          Submit form
        </CButton>
      </CCol>
    </CForm>
  )
}

const Validation = (props) => {
  const {chageSteps} = props
  const {setSlug} = props
  const {setBatchCout} = props
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo , batches } = state
  
  const [Batches, setBatches] = useState(batches);
  const token = localStorage.getItem('accessToken')
  
  // function for the load batches
  
  const loadBatches = async() => {
    const header = {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`,
      'ngrok-skip-browser-warning':true
    }
    
    axios.get(`${base_url}/manage/get_batches`,{headers:header})
    .then((response)=>{
      ctxDispatch({ type: 'GET_BATCHES', payload: response.data.data });
      //console.log(state.batches);
      setBatches(response.data.data)
    })
    .catch((error)=>{
      console.log("error");
    })
  }

  useEffect(() => {
    loadBatches()
  }, []);

  useEffect(() => {
    console.log(Batches);
  }, [Batches]);
  
  
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Batches</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(Batches,setBatches,setBatchCout)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Batches History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border text-center" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Batches</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Batches.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.batch_name}</div>   
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton style={{ marginRight: '10px' }}>View Details</CButton>
                        <CButton onClick={() => {chageSteps('semester'); setSlug(item.slug);}} >Add Semester</CButton>
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

Validation.propTypes = {
  chageSteps: PropTypes.func.isRequired,
  setSlug: PropTypes.func.isRequired,
  setBatchCout:PropTypes.func.isRequired
}

export default Validation
