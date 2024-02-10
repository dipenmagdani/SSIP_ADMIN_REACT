import React from 'react'

import { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CToast,
  CToastHeader,
  CToastBody,
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import { useEffect } from 'react'
import useAPI from 'src/global_function/useApi'

export default function Teacherview() {
  const [StoredTokens, CallAPI] = useAPI()
  const [TimeTables, setTimeTables] = useState(null)
  const load_teacher_timetable = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_timetable_for_teacher',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      console.log(response.data.data)
      setTimeTables(response.data.data)
    }
  }
  useEffect(() => {
    load_teacher_timetable()
  }, [])

  return (
    <>
      <CRow className="mb-3">
      <CCol>
        {TimeTables ? (
          TimeTables.map((timetable, index) => (
            <CRow key={index} className="text-center mb-5 justify-content-center">
              <CCol className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                <CCard className="">
                  <CCardHeader className="d-flex justify-content-center justify-content-sm-between flex-wrap">
                    <span>Semester - {timetable.division.semester.no}</span>
                    <span>Division - {timetable.division.division_name}</span>
                  </CCardHeader>
                  <CCardBody>
                    <>
                      <CRow className="text-center mb-5 justify-content-center">
                        <CCol className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                          <CCard className="">
                            <CCardBody>
                              <CRow className="flex-column" style={{ padding: '0' }}>
                                {timetable ? (
                                  timetable.schedules.map((item, index) => (
                                    <>
                                      <CCol
                                        className="mb-4 d-flex align-items-center flex-column"
                                        key={index}
                                      >
                                        <CAlert
                                          className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center"
                                          color="primary"
                                          visible={true}
                                          onClose={() => setVisible(false)}
                                        >
                                          {item.day.toUpperCase()}
                                        </CAlert>
                                        <CCard className="w-100  rounded-0 border-0">
                                          <CCardBody className="">
                                            <CRow className="justify-content-center">
                                              {item.lectures.length > 0 ? (
                                                item.lectures.map((lecture, index) => (
                                                  <CToast
                                                    key={index}
                                                    autohide={false}
                                                    visible={true}
                                                    className="mb-3 w-100"
                                                  >
                                                    <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center">
                                                      <div className="fw-bold mx-2 my-2">
                                                        {lecture.subject.subject_name}
                                                      </div>
                                                        <small className='mx-2 my-2'>
                                                          {lecture.type.toUpperCase()}
                                                        </small>
                                                      <small className='mx-2 my-2'>
                                                        {lecture.start_time.slice(0, 5)} |{' '}
                                                        {lecture.end_time.slice(0, 5)}
                                                      </small>
                                                    </CToastHeader>
                                                    <CToastBody className="d-flex flex-row flex-wrap justify-content-center justify-content-md-between">
                                                      <span className="mx-3">
                                                        Prof - {lecture.teacher}{' '}
                                                      </span>
                                                      <span>
                                                        batches -{' '}
                                                        {lecture.batches.map((batch, index) => (
                                                          <span key={index}>
                                                            {batch.batch_name}
                                                            {index < lecture.batches.length - 1 &&
                                                              ', '}
                                                          </span>
                                                        ))}{' '}
                                                      </span>{' '}
                                                      <span className="mx-3">
                                                        {lecture.classroom.class_name}
                                                      </span>{' '}
                                                    </CToastBody>
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
                                      </CCol>
                                    </>
                                  ))
                                ) : (
                                  <p>no schedule</p>
                                )}
                              </CRow>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    </>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          ))
        ) : (
          <CToast animation={false} autohide={false} visible={true} className="mx-auto w-100">
            <CToastHeader className="bg-dark d-flex justify-content-center">
              <img
                src="/static/media/smartroll_logo.a3c3e21d0b4a56919e74.png"
                width={100}
                alt="SmartRoll Logo"
              />
            </CToastHeader>
          </CToast>
        )}
        </CCol>
      </CRow>
    </>
  )
}
