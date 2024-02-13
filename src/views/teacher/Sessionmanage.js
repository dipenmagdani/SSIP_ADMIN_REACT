import React, { useState, useRef, useEffect, useContext } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel';

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
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import '../../css/tailwind.css'
import useAPI from 'src/global_function/useApi'
import axios from 'axios'
import { websocket } from 'src/base_url'
import { Store } from '../forms/validation/store'
import { useNavigate } from 'react-router-dom'

const Sessionmanage = () => {
  const url = new URL(window.location.href.replace('/#', ''))
  const [lectureSlug] = useState(url.searchParams.get('slug'))
  const [session_data, setSessionData] = useState(null)
  const [attendances, setAttendances] = useState(null)
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { accessToken } = state
  const tableRef = useRef(null);
  const [sessionEnded,setSessionEnded] = useState(false)
  const ws = useRef(null)
  const navigate =  useNavigate()
  const [StoredTokens, CallAPI] = useAPI()

  useEffect(() => {
    if (lectureSlug) {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      CallAPI(
        StoredTokens,
        axiosInstance,
        '/manage/session/create_lecture_session/',
        'post',
        headers,
        { lecture_slug: lectureSlug },
        null,
      ).then((responseobj) => {
        if (responseobj.error === false) {
          const response = responseobj.response
          if (!ws.current) {
            ws.current = new WebSocket(
              `${websocket}/ws/attendance_session/${response.data.data.session_id}/?${accessToken}`,
            )
          }
          setAttendances(response.data.data.marked_attendances)
          setSessionData(response.data.data)
        } else {
          alert(responseobj.errorMessage.message)
          navigate("/teacherdashboard")
        }
      })
    }
  }, [lectureSlug])

  useEffect(() => {
    if (ws.current) {
      ws.current.onopen = () => {
        console.log('WebSocket connection established')
      }

      ws.current.onclose = () => {
        console.log('WebSocket connection closed')
      }

      ws.current.onmessage = (event) => {
        let data = JSON.parse(event.data)
        console.log(data)
        if(data.message){
          if (data.message.action == 'attendance_marked') {
            setAttendances((prevArray) => [...prevArray, data.message.data])
          }else if (data.message.action == 'session_ended') {
            setAttendances(data.message.data.marked_attendances)
              alert('Session has ended')
              setSessionEnded(true)
              // navigate("/teacherdashboard")
          }else if (data.message.action == 'session_already_ended') {
              // setSessionEnded(true)
              alert('Session has already been ended')
          }
        }
        // Handle received message
      }

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    }
  }, [ws.current])

  const stopAttendance = () => {
    if(ws.current){
        ws.current.send(JSON.stringify({
            action:'end_session'
        }))
    }
  }

  return (
    <>
      {session_data ? (
        <>
        
          <CRow>
            <CCol>
              <CCard className="card">
                <CCardHeader>
                  <div className="d-flex justify-content-sm-between justify-content-center flex-wrap">
                    <div className="mx-3 mb-2">
                      <strong>Lecture Details</strong>
                    </div>
                    <div className="mx-3">
                      <strong>{new Date(session_data.created_at).toLocaleString()}</strong>
                    </div>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <div className="d-flex flex-wrap w-100">
                    <div className="col-12">
                      <div className="w-100 d-flex flex-wrap flex-1 justify-center">
                        <div className="text-center col-12 col-sm-3 col-md-3 col-lg-3">                          
                          <p style={{ margin: '0px', padding: '0px' }}>
                            {session_data.lecture.start_time} | {session_data.lecture.end_time}
                          </p>
                        </div>
                        <div className="text-center col-12 col-sm-3 col-md-3 col-lg-3">                          
                          <p style={{ margin: '0px', padding: '0px' }}>
                            {session_data.lecture.subject.subject_name}
                          </p>
                        </div>
                        <div className="text-center col-12 col-sm-3 col-md-3 col-lg-3">
                          <p style={{ margin: '0px', padding: '0px' }}>
                            {session_data.lecture.type}
                          </p>
                        </div>
                        <div className="text-center col-12 col-sm-3 col-md-3 col-lg-3">
                          <p style={{ margin: '0px', padding: '0px' }}>
                            {session_data.lecture.classroom.class_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader className="">                  
                 {!sessionEnded ? ( <div className='my-2 w-100 btn btn btn-outline-danger' onClick={() => {stopAttendance()}}>
                    <span className='me-3 d-inline'>End Session</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="d-inline bi bi-stop-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z" />
                    </svg>
                  </div>) : (<DownloadTableExcel
                        filename={`${session_data.lecture.subject.subject_name} - ${new Date(session_data.lecture.session.day).toLocaleString()}`}
                        sheet="users"
                        currentTableRef={tableRef.current}
                    >

                      <button className='my-2 w-100 btn btn btn-outline-primary'> Export excel </button>

                    </DownloadTableExcel>)}

                </CCardHeader>
                <CCardBody>
                  <CRow className="w-100 flex-col">
                    <CCol className="col-12">
                    <div className='table-responsive'>
                      <table align="middle" className="table align-middle table-hover mb-0 border text-center mb-0 border text-center" hover responsive ref={tableRef}>
                        <CTableHead color="light">
                        <CTableRow aria-colspan={5}>
                            <CTableHeaderCell colSpan={5}>L.D COLLEGE OF ENGINEERING</CTableHeaderCell>
                          </CTableRow>
                          <CTableRow aria-colspan={5}>
                            <CTableHeaderCell colSpan={5}>Subject: {session_data.lecture.subject.subject_name} | DATE: {session_data.lecture.session.day}</CTableHeaderCell>
                          </CTableRow>
                          <CTableRow>
                            {/* <CTableHeaderCell>SR. NO</CTableHeaderCell> */}
                            <CTableHeaderCell>Enrollment No</CTableHeaderCell>
                            <CTableHeaderCell>Student Name</CTableHeaderCell>
                            <CTableHeaderCell>IP Addr</CTableHeaderCell>
                            <CTableHeaderCell>Batch</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {attendances &&
                            attendances.map((item, index) => (
                              <CTableRow v-for="alert alert-primary item in tableItems" key={index}>
                                {/* <CTableDataCell>
                                        <div>{item.student.sr_no}</div>   
                                </CTableDataCell> */}
                                <CTableDataCell>
                                  <div>{item.student.enrollment ? item.student.enrollment: "-"}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div>{item.student.profile.name ? item.student.profile.name: '-'}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div>{item.marking_ip ? item.marking_ip : '-'}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                <div>
                                  {item.batches
                                    ? item.batches.map((batch, index) => (
                                        <span key={index}>{batch.batch_name.toUpperCase()}</span>
                                      ))
                                    : '-'}
                                </div>

                                </CTableDataCell>
                                {item.is_present ? (<CTableDataCell>
                                  <div className="text-success">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="mx-auto bi bi-patch-check"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0"
                                      />
                                      <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z" />
                                    </svg>
                                    <p style={{visibility:'hidden'}}>P</p>
                                  </div>
                                </CTableDataCell>): (<CTableDataCell>
                                  <div className="text-danger">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                                    <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                  </svg>
                                    <p style={{visibility:'hidden'}}>F</p>
                                  </div>
                                </CTableDataCell>)}
                              </CTableRow>
                            ))}
                        </CTableBody>
                      </table>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      ) : (
    <>                
        <div role="status" className="p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
            <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="flex items-baseline mt-4">
                <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-300"></div>
                <div className="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-300"></div>
                <div className="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-300"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
        <div role="status" className="p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
            <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="flex items-baseline mt-4">
                <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-300"></div>
                <div className="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-300"></div>
                <div className="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-300"></div>
                <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-300"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
        </>
      )}
    </>
  )
}

export default Sessionmanage
