import React from 'react';
import { useState } from 'react';
import 'src/scss/panel.css'
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
    COffcanvas,
    COffcanvasHeader,
    COffcanvasTitle,
    CCloseButton,
    COffcanvasBody,
    CFormCheck,
    
  } from '@coreui/react'



const CustomStyles = () => {
    const [validated, setValidated] = useState(false)
    
    const handleSubmit = (event) => {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      }
      
      setValidated(true)
    }
    return (
      <CForm
        className="row g-3 needs-validation"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom01">Teacher Name</CFormLabel>
          <CFormInput type="text" id="validationCustom01"  required />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom01">Teacher Moblie No</CFormLabel>
          <CFormInput type="tel" id="validationCustom02" pattern="[0-9]{10}"  required />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom01">Teacher E-mail</CFormLabel>
          <CFormInput type="email" id="validationCustom02"  required />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom02">Teacher Password</CFormLabel>
          <CFormInput type="password" id="validationCustom02"  required />
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

const Teacher = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    alert("click")
  };

  const [isPanelOpen, setPanelOpen] = useState(false);

  const togglePanel = () => {
    setPanelOpen(!isPanelOpen);
  };
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleCheckboxChange = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selected) => selected !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedOptions);
    console.log(selectedOptions);
  };

  const checkboxOptions = [
    'Option 1',
    'Option 2',
    'Option 3'
  ];
  
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Teachers</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles()}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Teacher History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Mobile No</CTableHeaderCell>
                    <CTableHeaderCell>E-mail</CTableHeaderCell>
                    <CTableHeaderCell>Password</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                      <CTableDataCell>
                        <div>1</div>
                        <div className="small text-medium-emphasis">
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>1</div>
                        <div className="small text-medium-emphasis">
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>1</div>
                        <div className="small text-medium-emphasis">
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>1</div>
                        <div className="small text-medium-emphasis">
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton style={{ marginRight: '10px' }}>View Details</CButton>
                        <CButton onClick={() => setVisible(true)}>Add Semester</CButton>
                      </CTableDataCell>
                      </CTableRow>  
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
      
      <COffcanvas placement="end" visible={visible} onHide={() => setVisible(false)}>
      <COffcanvasHeader>
        <COffcanvasTitle>Offcanvas</COffcanvasTitle>
        <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
      </COffcanvasHeader>
      <COffcanvasBody>
      {checkboxOptions.map((option) => (
                        
                        <CFormCheck id="flexCheckDefault" key={option} onSelect={selectedOptions}  label="Default checkbox"/>
                      ))}
      </COffcanvasBody>
    </COffcanvas>
        
      
    </>
  );
}

export default Teacher;
