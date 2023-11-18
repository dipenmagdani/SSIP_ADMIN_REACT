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
import {base_url} from "src/base_url"
const CustomStyles = () => {
  
  const [validated, setValidated] = useState(false)
  const [Start, setStart] = useState("");
  const [End, setEnd] = useState("");
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
      setBatches(response.data.data)
      console.log(batches);
      
    })
    .catch((error)=>{
      console.log("error");
    })
  }

  // function for add the batches
  const addBatches = async(body) => {
    const headers = {
      'Content-Type': 'application/json', // Set the content type based on your API requirements
      'Authorization': `Bearer ${token}`, // Include any authorization headers if needed
    };
    axios.post(`${base_url}/manage/get_batches`,body,{headers})
    .then((response)=>{
      console.log(response);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  
  useEffect(() => {
    loadBatches()
  }, []);
  
  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    const body = {
      batch_name: Start + "-" + End
    }
    
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
        <CButton color="primary" type="submit">
          Submit form
        </CButton>
      </CCol>
    </CForm>
  )
}

const Validation = (props) => {
 
  useEffect(() => {
    return () => {
          
    };
  }, []);
 
 
  const { nextForm } = props
  
  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      payment: { name: 'Visa', icon: cibCcVisa },
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cifIn },
      payment: { name: 'Stripe', icon: cibCcStripe },
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cifFr },
      payment: { name: 'PayPal', icon: cibCcPaypal },
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cifEs },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cifPl },
      payment: { name: 'Amex', icon: cibCcAmex },
    },
  ]
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Batches</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles()}</CCardBody>
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
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Batches</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton style={{ marginRight: '10px' }}>View Details</CButton>
                        <CButton onClick={nextForm}>Add Semester</CButton>
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
  nextForm: PropTypes.func.isRequired,
}

export default Validation
