import React from 'react'

import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CTableHead,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CHeader,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CAlert
} from '@coreui/react'
import axios from 'axios'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import FormControl from '../forms/form-control/FormControl'
import Select from '../forms/input-group/InputGroup'
import Validation from '../forms/validation/Validation'
import { useContext, useEffect } from 'react'
import { Store } from 'src/views/forms/validation/store'
import base_url from 'src/base_url'
import Breadcrumbnav from '../breadcrum/Breadcrumbnav'
import expireToken from 'src/global_function/unauthorizedToken'
import { SetLecture } from '../timetable/SetLecture'
import { useNavigate } from 'react-router-dom'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
import useAPI from 'src/global_function/useApi'

export default function Teacherview() {
  const [StoredTokens,CallAPI] = useAPI()
  const [timetable, set_timetable] = useState([])
  const load_teacher_timetable = async()=>{
      const headers = {
        "Content-Type":"application/json",
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      const response_obj = await CallAPI(StoredTokens,axiosInstance,"/manage/get_timetable_for_teacher","get",headers,null,null)
      if(response_obj.error === false)
      {
        const response = response_obj.response
        console.log(response.data.data)
        set_timetable(response.data.data)
      }
  }
  useEffect(() => {
    load_teacher_timetable()
  }, [])
  
  return (
    <>

      <CRow className="mb-3">
      {timetable ? (
        <>
          <CRow className='text-center mb-5 justify-content-center'>
            <CCol className='col-lg-10 col-md-10 col-sm-12 col-xs-12'>
              <CCard className="">
                <CCardHeader>
                  TimeTable
                </CCardHeader>
                <CCardBody>
                  {/* <CRow className="flex-column" style={{ padding: '0' }}>
                    {timetable ? (
                        timetable.map((item, index) => (
                        <>
                          <CCol className="mb-4 d-flex align-items-center flex-column" key={index}>                        
                              <CAlert className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center" color="primary" visible={true}>
                                  {item.day.toUpperCase()}
                                  <button
                                    className="h-20 btn"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-plus-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                  </button>
                              </CAlert>                            
                            <CCard className="w-100  rounded-0 border-0">
                              <CCardBody className=''>
                              <CRow className="justify-content-center">
                                      {item.lectures.length > 0 ? (
                                        item.lectures.map((lecture,index) => (
                                          <CToast key={index} autohide={false} visible={true} className='mb-3 w-100'>
                                            <CToastHeader className='d-flex flex-wrap justify-content-center'>                                              
                                              <div className="fw-bold me-auto">{lecture.subject.subject_name}</div>
                                              <small>{lecture.start_time.slice(0, 5)} | {lecture.end_time.slice(0, 5)}</small>
                                            </CToastHeader>
                                            <CToastBody className='d-flex flex-row flex-wrap justify-content-center justify-content-md-between'><span className='mx-3'>Prof - {lecture.teacher} </span><span>batches - {lecture.batches.map((batch, index) => (<span key={index}>{batch.batch_name}{index < lecture.batches.length - 1 && ', '}</span> ))} </span> <span className='mx-3'>{lecture.classroom.class_name}</span> </CToastBody>
                                          </CToast>
                                        )) 
                                      ) : (
                                        <CToast autohide={false} visible={true}>                 
                                            <CToastBody>No Lectures Found</CToastBody>
                                        </CToast>
                                      )}                                    
                                </CRow>
                              </CCardBody>
                            </CCard>
                          </CCol></>
                        ))                     
                    ) : (
                      <p>no schedule</p>
                    )}
                  </CRow> */}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      ) : (
        <CToast animation={false} autohide={false} visible={true} className="mx-auto w-100">
          <CToastHeader className="bg-dark d-flex justify-content-center">
            <img src="/static/media/smartroll_logo.a3c3e21d0b4a56919e74.png" width={100}></img>
          </CToastHeader>
          
        </CToast>
      )} 
      </CRow>
      
    </>
  )
}
