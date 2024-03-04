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
import { useNavigate } from 'react-router-dom'
import moment from 'moment';


export default function Teacherview() {

  // usestate to opne and close the model  
  const navigation = useNavigate()

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
    else {
      alert(response_obj.errorMessage.message)
    }
  }


  const create_Session = async (lecture_slug) => {
    navigation(`/teacher/session?slug=${lecture_slug}`)
  }

  useEffect(() => {
    load_teacher_timetable()
  }, [])

  return (
    <>
      <CRow className="mb-3">
        <CCol>
          {
            TimeTables && TimeTables.map((branch, index) => {

              return branch.semesters.map((semester, index) => {

                return (
                  <div key={index} >
                    <CAlert
                      className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center mb-2"
                      color="primary"
                      visible={true}
                    >
                      {branch.branch_name}
                    </CAlert>
                    {semester.divisions.map((division, index) => {
                      console.log(division)
                      return division.timetable.schedule ? (division.timetable.schedule.lectures.length > 0 ? (
                        division.timetable.schedule.lectures.map((lectures, index) => {
                          return (
                            <div key={index} className='d-flex justify-content-center'>
                              <CRow className="flex-column" style={{ padding: '0' }}>
                                <CCol className="d-flex align-items-center flex-column" key={index}>
                                  <div className="w-100 rounded-0 border-0">
                                    <div className="" style={{ paddingBottom: "0px" }}>
                                      <div className="justify-content-center w-100">
                                        <CToast
                                          key={index}
                                          autohide={false}
                                          visible={true}
                                          className={`mb-3 mt-3 w-100 ${lectures.is_proxy ? "border-red-700" : ""}`}
                                        >
                                          <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center mx-2">
                                            {lectures.is_proxy ? (
                                              <div className={`w-100 fw-bold text-center`}>
                                                <div>
                                                  <small className='mx-2 my-2'>

                                                    Semester: {semester.no} | Division : {division.division_name}
                                                  </small>
                                                </div>
                                                <div>
                                                  <small className='mx-2 my-2'>
                                                    {lectures.is_proxy ? "Proxied from " : ""}
                                                    {lectures.link ? lectures.link.from_lecture.subject.subject_name : ""}
                                                  </small>
                                                </div>

                                                <hr className='w-100 my-2'></hr>

                                              </div>
                                            ) : (null)}
                                            <div className="fw-bold mx-2">
                                              {lectures.subject.subject_name.charAt(0).toUpperCase() + lectures.subject.subject_name.slice(1)}
                                            </div>
                                            <small className='mx-2 my-2'>
                                              {lectures.type.toUpperCase()}
                                            </small>
                                            <small className='mx-2 my-2'>
                                              {moment(lectures.start_time.slice(0, 5), 'HH:mm').format('h:mm A')} |{' '}
                                              {moment(lectures.end_time.slice(0, 5), 'HH:mm').format('h:mm A')}
                                            </small>
                                          </CToastHeader>
                                          <CToastBody className="d-flex flex-row flex-wrap justify-content-center">
                                            <CRow className='w-100 align-items-center'>
                                              <CCol className='text-sm-start text-center col-12 col-sm-4 col-lg-4 col-md-4'>
                                                Prof - {lectures.teacher.charAt(0).toUpperCase() + lectures.teacher.slice(1)}
                                              </CCol>
                                              <CCol className=' text-sm-end col-12 col-sm-4 col-lg-4 col-md-4'>
                                                <div className='w-100 text-center'>
                                                  {' '}
                                                  {lectures.batches.map((batch, index) => (
                                                    <span key={index}>
                                                      {batch.batch_name.toUpperCase()}
                                                      {index < lectures.batches.length - 1 &&
                                                        ', '}
                                                    </span>
                                                  ))}{' '}
                                                </div>
                                              </CCol>
                                              <CCol className='text-sm-end text-center col-12 col-sm-4 col-lg-4 col-md-4'>
                                                {lectures.classroom.class_name.charAt(0).toUpperCase() + lectures.classroom.class_name.slice(1)}
                                                {' '}
                                              </CCol>
                                            </CRow>

                                            <div className='d-flex w-100'>
                                              <div className='w-100'>
                                                {lectures.session.active === "pre" && <button className='btn btn-outline-primary w-100 mt-3' value={lectures.slug} onClick={(e) => create_Session(e.target.value)}>Start Session</button>}
                                                {lectures.session.active === "ongoing" && <button className='btn btn-outline-primary w-100 mt-3' value={lectures.slug} onClick={(e) => create_Session(e.target.value)}>Ongoing Session</button>}
                                                {lectures.session.active === "post" && <button disabled={true} className='btn btn-outline-secondary w-100 mt-3'>Session Ended</button>}
                                              </div>
                                            </div>
                                            <div>
                                            </div>
                                          </CToastBody>
                                        </CToast>
                                      </div>
                                    </div>
                                  </div>
                                </CCol>
                              </CRow>
                            </div>
                          )
                        })
                      ) : (null)) : (<div className='d-flex justify-content-center w-100 my-3'><CToast className='w-100' animation={false} autohide={false} visible={true}>
                        
                        <CToastBody className='text-center'>There is no lecture today....</CToastBody>
                      </CToast></div>)
                      
                    })}
                  </div>
                )
              })
            })
          }

        </CCol>

      </CRow>
    </>
  )
}
