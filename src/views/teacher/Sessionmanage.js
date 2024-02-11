import React, { useState, useRef, useEffect, useContext } from 'react'
import {
    COffcanvas,
    COffcanvasBody,
    CAlert,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from '@coreui/react'
import { Controller, useForm } from "react-hook-form"
import useAPI from 'src/global_function/useApi'
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom'
import { websocket } from 'src/base_url'
import { Store } from '../forms/validation/store'

const Sessionmanage = () => {
    const location = useLocation();
    const [session_data, setSessionData] = useState(location.state);
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { accessToken, refreshToken, batches, currentBatch, objectCount} = state
    const ws = useRef(null);
  
    useEffect(() => {
        console.log(`${websocket}/ws/attendance_session/${session_data.session_id}/`)
        console.log(accessToken)
      try {
        if (!ws.current) {
          ws.current = new WebSocket(`${websocket}/ws/attendance_session/${session_data.session_id}/`,[accessToken]);
        }
  
        // WebSocket event listeners
        ws.current.onopen = () => {
          console.log('WebSocket connection established');
        };
  
        ws.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
  
        ws.current.onmessage = (event) => {
          console.log('Received message from server:', event.data);
          // Handle received message
        };
  
        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Error:', error);
      }
  
      // Cleanup function
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }, []);

    return (
        <>
            {
                session_data ? (
                    <>
                        <CRow>
                            <CCol>

                                <CCard className="card w-100">
                                    <CCardHeader>
                                        <CRow>
                                            <CCol>
                                                <strong>Session Details</strong>
                                            </CCol>
                                            <CCol className='text-end'>
                                                <strong>Date|Time : {new Date(session_data.created_at).toLocaleString()}</strong>
                                            </CCol>
                                        </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className='w-100'>
                                            <CCol className='col-12'>
                                                <CRow className='w-100 flex-1 justify-center'>
                                                    <CCol className='text-center col-12 col-sm-3 col-md-3 col-lg-3'>
                                                        <p className='font-weight-bold' style={{ margin: "0px", padding: "0px", fontWeight: "bold" }}>Time</p>
                                                        <p style={{ margin: "0px", padding: "0px" }}>{session_data.lecture.start_time} | {session_data.lecture.end_time}</p>
                                                    </CCol>
                                                    <CCol className='text-center col-12 col-sm-3 col-md-3 col-lg-3'>
                                                        <p className='font-weight-bold' style={{ margin: "0px", padding: "0px", fontWeight: "bold" }}>Subject</p>
                                                        <p style={{ margin: "0px", padding: "0px" }}>{session_data.lecture.subject.subject_name}</p>
                                                    </CCol>
                                                    <CCol className='text-center col-12 col-sm-3 col-md-3 col-lg-3'>
                                                        <p className='font-weight-bold' style={{ margin: "0px", padding: "0px", fontWeight: "bold" }}>Lecture Type</p>
                                                        <p style={{ margin: "0px", padding: "0px" }}>{session_data.lecture.type}</p>
                                                    </CCol>
                                                    <CCol className='text-center col-12 col-sm-3 col-md-3 col-lg-3'>

                                                        <p className='font-weight-bold' style={{ margin: "0px", padding: "0px", fontWeight: "bold" }}>Classroom No.</p>
                                                        <p style={{ margin: "0px", padding: "0px" }}>{session_data.lecture.classroom.class_name}</p>
                                                    </CCol>
                                                </CRow>
                                            </CCol>
                                            <CCol>

                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow className='mt-3'>
                            <CCol xs>
                                <CCard className="mb-4">
                                    <CCardHeader>
                                        <strong>Attedence</strong>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow className='w-100 flex-col'>
                                            <CCol className='col-12'>
                                                <CTable align="middle" className="mb-0 border text-center" hover responsive>
                                                    <CTableHead color="light">
                                                        <CTableRow>
                                                            <CTableHeaderCell>SR. NO</CTableHeaderCell>
                                                            <CTableHeaderCell>Enrollment No</CTableHeaderCell>
                                                            <CTableHeaderCell>Student Name</CTableHeaderCell>
                                                            <CTableHeaderCell>Batch</CTableHeaderCell>
                                                            <CTableHeaderCell>attendace Status</CTableHeaderCell>
                                                        </CTableRow>
                                                    </CTableHead>
                                                    {/* <CTableBody>
                                                    {semester.map((item, index) => (
                                                        <CTableRow v-for="item in tableItems" key={index} onClick={() => { chageSteps('division'); set_semester_slug(item.slug); }}>
                                                            <CTableDataCell>
                                                                <div>{item.no}</div>
                                                            </CTableDataCell>

                                                            <CTableDataCell>
                                                                <div>
                                                                    {item.status ? (<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                    </svg>{ }
                                                                    </div>) : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                                                                    </svg>}
                                                                </div>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    ))}
                                                </CTableBody> */}
                                                </CTable>
                                            </CCol>
                                            <CCol className='col-12'>
                                                <CRow className='justify-end'>
                                                    <CCol>
                                                        <CRow className='flex-column'>
                                                            <CCol>
                                                                <div>
                                                                    <span>Total Student : {session_data.attendances.length}</span>
                                                                </div>
                                                            </CCol>
                                                            <CCol>
                                                                <div>
                                                                    <span>Present Student : 90</span>
                                                                </div>
                                                            </CCol>
                                                            <CCol>
                                                                <div>
                                                                    <span>Absent : 10</span>
                                                                </div>
                                                            </CCol>
                                                        </CRow>
                                                    </CCol>
                                                </CRow>
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                    </>
                ) : (<p>No session availabe</p>)
            }

        </>
    )
}

export default Sessionmanage