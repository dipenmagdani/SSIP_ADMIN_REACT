import React, { useEffect, useState, useContext} from 'react'
import {
    COffcanvas,
    COffcanvasHeader,
    COffcanvasTitle,    
    COffcanvasBody,       
    CCard,
    CCardBody,
    CCardHeader,
    CCol,    
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormCheck,
    CTableDataCell,
    CToast,
    CToastHeader,
    CToastBody
  } from '@coreui/react'

function SetLecture({visible,setVisible,scheduleObj,lectureObj}) {
    useEffect( () => {        
        if(visible){     
        }
    },[visible])      
  return (
    <>
    <COffcanvas className='card w-100' style={{background:'#3c4b64'}} placement="end" visible={visible} onHide={() => setVisible(false)} data-coreui-backdrop="static">
    <COffcanvasHeader className='card-header text-light' style={{background:'#303c54'}}>
      <COffcanvasTitle>Manage Lecture</COffcanvasTitle>
      <button className='btn btn-outline-light' onClick={() => setVisible(false)} >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>      
    </COffcanvasHeader>
    <COffcanvasHeader className='card-header text-light' style={{background:'#303c54'}}>
      <COffcanvasTitle>Day: {scheduleObj.day} | Slot: {lectureObj.start_time} - {lectureObj.end_time}</COffcanvasTitle>      
    </COffcanvasHeader>
    <COffcanvasBody>    
    <CRow>
    <CCol xs style={{}}></CCol>
    </CRow>
    </COffcanvasBody>
  </COffcanvas>
  </>
  )
}

export default SetLecture