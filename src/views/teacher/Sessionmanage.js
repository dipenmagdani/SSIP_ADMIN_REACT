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
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import useAPI from 'src/global_function/useApi'
import axios from 'axios'
import { websocket } from 'src/base_url'
import { Store } from '../forms/validation/store'

const Sessionmanage = () => {
  const url = new URL(window.location.href.replace('/#', ''))
  const [lectureSlug] = useState(url.searchParams.get('slug'))
  const [session_data, setSessionData] = useState(null)
  const [attendances, setAttendances] = useState(null)
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { accessToken } = state
  const ws = useRef(null)
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
        if (data.message.action == 'attendance_marked') {
          setAttendances((prevArray) => [...prevArray, data.message.data])
        }else if (data.message.action == 'session_ended') {
            alert('Session has ended')
        }else if (data.message.action == 'session_already_ended') {
            alert('Session has already been ended')
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
                  <div className='my-2 w-100 btn btn btn-outline-danger' onClick={() => {stopAttendance()}}>
                    <span className='me-3'>End Session</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-stop-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z" />
                    </svg>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CRow className="w-100 flex-col">
                    <CCol className="col-12">
                      <CTable align="middle" className="mb-0 border text-center" hover responsive>
                        <CTableHead color="light">
                          <CTableRow>
                            {/* <CTableHeaderCell>SR. NO</CTableHeaderCell> */}
                            <CTableHeaderCell>Enrollment No</CTableHeaderCell>
                            <CTableHeaderCell>Student Name</CTableHeaderCell>
                            <CTableHeaderCell>IP Addr</CTableHeaderCell>
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
                                  <div>{item.student.enrollment}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div>{item.student.profile.name}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div>{item.marking_ip}</div>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div className="text-success">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-patch-check"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0"
                                      />
                                      <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911z" />
                                    </svg>
                                  </div>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                        </CTableBody>
                      </CTable>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      ) : (
        <p>No session availabe</p>
      )}
    </>
  )
}

export default Sessionmanage