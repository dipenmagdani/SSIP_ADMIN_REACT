import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
import moment from 'moment'

const StudentDashboard = () => {
  const [StoredTokens, CallAPI] = useAPI()
  const [TimeTables, setTimeTables] = useState(null)
  const [permission_state, set_permission_state] = useState(false)
  const [attendSurveyDropdown, setAttendSurveyDropdown] = useState(true)
  const [markedSurveys, setMarkedSurveys] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSurveySubmit = async (data) => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/session/submit_survey/',
      'post',
      headers,
      data,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
    } else {
      setMarkedSurveys((markedSurveys) => [...markedSurveys, data.survey_slug])
      alert(response_obj.errorMessage.message)
    }
  }

  const load_teacher_timetable = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_timetable_for_student',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      setTimeTables(response.data.data)
    }
  }

  const get_location_permission = () => {
    // if(!permission_state){
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        set_permission_state(true)
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition((position) => {
          set_permission_state(true)
        })
      } else if (result.state === 'denied') {
        navigator.geolocation.getCurrentPosition((position) => {
          set_permission_state(true)
        })
      }
      result.addEventListener('change', () => {
        if (result.state === 'granted') {
          set_permission_state(true)
        } else if (result.state === 'prompt') {
          set_permission_state(false)
        } else if (result.state === 'denied') {
          set_permission_state(false)
        }
      })
    })
    // }
  }
  const mark_attendance = async (btn, lecture_slug) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }
    try {
      navigator.geolocation.getCurrentPosition(
        async (positions) => {
          const latitude = positions.coords.latitude
          const longitude = positions.coords.longitude
          const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': true,
          }
          const axiosInstance = axios.create()
          const response_obj = await CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/session/mark_attendance_for_student/',
            'post',
            headers,
            { lecture_slug: lecture_slug, latitude: latitude, longitude: longitude },
            null,
          )
          if (response_obj.error === false) {
            const response = response_obj.response
            if (response.data.data === true) {
              btn.disabled = true
              btn.classList.add('btn-outline-secondary')
              alert('your Attendance Marked successfully')
            }
          } else {
            if (response_obj.errorMessage.code == 100) {
              btn.disabled = true
              btn.classList.add('btn-outline-secondary')
            }
            alert(response_obj.errorMessage.message)
          }
        },
        (error) => {
          alert(error.message)
          return
        },
        { enableHighAccuracy: true, maximumAge: 0 },
      )
    } catch (error) {
      alert('Location services are not available, Please enable it from you browser')
      return
    }
  }

  useEffect(() => {
    load_teacher_timetable()
  }, [])
  useEffect(() => {
    get_location_permission()
  }, [permission_state])

  return (
    <>
      {permission_state ? (
        <CRow className="mb-3">
          <CCol>
            {TimeTables &&
              TimeTables.map((branch, index) => {
                return branch.timetables.map((timetable, index) => {
                  return (
                    <div key={index}>
                      <CAlert
                        className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center mb-2"
                        color="primary"
                        visible={true}
                      >
                        {branch.branch_name}
                      </CAlert>
                      {timetable.schedule ? (
                        timetable.schedule.lectures.length > 0 ? (
                          timetable.schedule.lectures.map((lecture, index) => {
                            return (
                              <div key={index}>
                                <CRow className="flex-column" style={{ padding: '0' }}>
                                  <CCol
                                    className="d-flex align-items-center flex-column"
                                    key={index}
                                  >
                                    <div className="w-100 rounded-0 border-0">
                                      <div className="" style={{ paddingBottom: '0px' }}>
                                        <div className="justify-content-center w-100">
                                          <CToast
                                            key={index}
                                            autohide={false}
                                            visible={true}
                                            className={`mb-3 mt-3 w-100 ${
                                              lecture.is_proxy ? 'border-red-700' : ''
                                            }`}
                                          >
                                            <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center mx-2">
                                              <div
                                                className={`w-100 fw-bold text-center text-sm-start text-md-start text-lg-start`}
                                              >
                                                <div>
                                                  <small className="mx-2 my-2">
                                                    Semester: {timetable.division.semester.no} |
                                                    Division : {timetable.division.division_name}
                                                  </small>
                                                </div>
                                                <div>
                                                  {lecture.is_proxy ? (
                                                    <small className="mx-2 my-2">
                                                      {lecture.is_proxy ? 'Proxied from ' : ''}
                                                      {lecture.link
                                                        ? lecture.link.from_lecture.subject
                                                            .subject_name
                                                        : ''}
                                                    </small>
                                                  ) : null}
                                                </div>

                                                <hr className="w-100 my-2"></hr>
                                              </div>
                                              <div className="fw-bold mx-2">
                                                {lecture.subject.subject_name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  lecture.subject.subject_name.slice(1)}
                                              </div>
                                              <small className="mx-2 my-2">
                                                {lecture.type.toUpperCase()}
                                              </small>
                                              <small className="mx-2 my-2">
                                                {moment(
                                                  lecture.start_time.slice(0, 5),
                                                  'HH:mm',
                                                ).format('h:mm A')}{' '}
                                                |{' '}
                                                {moment(
                                                  lecture.end_time.slice(0, 5),
                                                  'HH:mm',
                                                ).format('h:mm A')}
                                              </small>
                                            </CToastHeader>
                                            <CToastBody className="d-flex flex-row flex-wrap justify-content-center">
                                              <CRow className="w-100 align-items-center">
                                                <CCol className="text-sm-start text-center col-12 col-sm-4 col-lg-4 col-md-4">
                                                  Prof -{' '}
                                                  {lecture.teacher.charAt(0).toUpperCase() +
                                                    lecture.teacher.slice(1)}
                                                </CCol>
                                                <CCol className=" text-sm-end col-12 col-sm-4 col-lg-4 col-md-4">
                                                  <div className="w-100 text-center">
                                                    {' '}
                                                    {lecture.batches.map((batch, index) => (
                                                      <span key={index}>
                                                        {batch.batch_name.toUpperCase()}
                                                        {index < lecture.batches.length - 1 && ', '}
                                                      </span>
                                                    ))}{' '}
                                                  </div>
                                                </CCol>
                                                <CCol className="text-sm-end text-center col-12 col-sm-4 col-lg-4 col-md-4">
                                                  {lecture.classroom.class_name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    lecture.classroom.class_name.slice(1)}{' '}
                                                </CCol>
                                              </CRow>

                                              <div className="d-flex w-100">
                                                <div className="w-100">
                                                  {(lecture.session.active === 'pre' ||
                                                    lecture.session.active === 'ongoing') && (
                                                    <button
                                                      className={`btn ${
                                                        lecture.session.attendances.is_present
                                                          ? 'btn-outline-secondary'
                                                          : 'btn-outline-primary'
                                                      } w-100 mt-3`}
                                                      value={lecture.slug}
                                                      onClick={(e) =>
                                                        !lecture.session.attendances.is_present &&
                                                        mark_attendance(e.target, e.target.value)
                                                      }
                                                      disabled={
                                                        lecture.session.attendances.is_present
                                                      }
                                                    >
                                                      Mark Your Attendance
                                                    </button>
                                                  )}
                                                  {lecture.session.active === 'post' && (
                                                    <button
                                                      className="btn btn-outline-secondary w-100 mt-3"
                                                      disabled={true}
                                                    >
                                                      Session Ended
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                              {lecture.survey &&
                                              !markedSurveys.includes(lecture.survey.slug) ? (
                                                <form
                                                  className="w-100"
                                                  onSubmit={handleSubmit(onSurveySubmit)}
                                                >
                                                  <div className="d-flex w-full">
                                                    <input
                                                      type="hidden"
                                                      value={lecture.survey.slug}
                                                      {...register('survey_slug')}
                                                    />
                                                    <div className="w-100">
                                                      <button
                                                        type="button"
                                                        className=" w-full bg-blue-700 p-2 mt-3 text-white"
                                                        onClick={() =>
                                                          setAttendSurveyDropdown(
                                                            !attendSurveyDropdown,
                                                          )
                                                        }
                                                      >
                                                        Attend Survey
                                                      </button>
                                                      <CToastBody
                                                        className={`flex-row flex-wrap justify-content-center bg-slate-200 ${
                                                          attendSurveyDropdown ? 'hidden' : 'flex'
                                                        }`}
                                                      >
                                                        <div
                                                          className={`w-100 fw-bold text-center text-sm-start text-md-start text-lg-start`}
                                                        >
                                                          <div>
                                                            <small className="mx-2 my-2 text-lg block">
                                                              {lecture.survey.title}
                                                            </small>
                                                            <small className="mx-2 my-2 text-xs flex items-center gap-2 text-blue-800">
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={16}
                                                                height={16}
                                                                fill="currentColor"
                                                                className="bi bi-check2-circle"
                                                                viewBox="0 0 16 16"
                                                              >
                                                                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                                                                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                                                              </svg>
                                                              {lecture.survey.allowd_choices ==
                                                              'single'
                                                                ? 'Choose One'
                                                                : 'Choose Many'}
                                                            </small>
                                                          </div>
                                                          <hr className="w-100 my-2"></hr>
                                                        </div>
                                                        {lecture.survey.options.map(
                                                          (option, index) => (
                                                            <div
                                                              className={`w-100 fw-bold text-center text-sm-start text-md-start text-lg-start`}
                                                              key={index}
                                                            >
                                                              <div>
                                                                <small className="mx-2 my-2 text-[1rem] text-black flex items-center gap-2">
                                                                  <input
                                                                    id="default-radio-1"
                                                                    type="radio"
                                                                    value={option.slug}
                                                                    name="default-radio"
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                                    {...register(
                                                                      'marked_option_slug',
                                                                    )}
                                                                  />
                                                                  {option.option}
                                                                </small>
                                                                <div className="w-full bg-gray-200  rounded-full h-2 dark:bg-gray-700">
                                                                  <div
                                                                    className="bg-green-600 h-2 rounded-full"
                                                                    style={{
                                                                      width: `${option.submission_percentage}%`,
                                                                    }}
                                                                  />
                                                                </div>
                                                              </div>
                                                              <hr className="w-100 my-2"></hr>
                                                            </div>
                                                          ),
                                                        )}
                                                        <div className="flex-initial py-3 w-full">
                                                          <button
                                                            className="w-full justify-center flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize   bg-slate-800 rounded-md hover:bg-gray-800  focus:outline-none focus:bg-gray-900  transition duration-300 transform active:scale-95 ease-in-out"
                                                            type="submit"
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              height="24px"
                                                              viewBox="0 0 24 24"
                                                              width="24px"
                                                              fill="#FFFFFF"
                                                            >
                                                              <path
                                                                d="M0 0h24v24H0V0z"
                                                                fill="none"
                                                              />
                                                              <path
                                                                d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z"
                                                                opacity=".3"
                                                              />
                                                              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z" />
                                                            </svg>
                                                            <span className="pl-2 mx-1">
                                                              Submit
                                                            </span>
                                                          </button>
                                                        </div>
                                                      </CToastBody>
                                                    </div>
                                                  </div>
                                                </form>
                                              ) : null}
                                              <div></div>
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
                        ) : (
                          <div className="d-flex w-100 justify-content-center">
                            <div className="alert alert-warning w-75 my-2 text-center ">
                              <span className="">
                                No lecture sessions are there for this branch
                              </span>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="d-flex justify-content-center w-full my-3">
                          <CToast
                            className="w-100"
                            animation={false}
                            autohide={false}
                            visible={true}
                          >
                            <CToastBody className="text-center w-full">
                              There is no lecture today....
                            </CToastBody>
                          </CToast>
                        </div>
                      )}
                    </div>
                  )
                })
              })}
          </CCol>
        </CRow>
      ) : (
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/ERhEIsEXG50?si=i9ez0hxneFCuAe6E"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}
    </>
  )
}

export default StudentDashboard
