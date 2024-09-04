import React, { act, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useAPI from 'src/global_function/useApi'
import axios from 'axios'
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
  CToast,
  CToastHeader,
  CToastBody,
  CButton,
} from '@coreui/react'
import { CreateSurvey } from './CreateSurvey'
function SurveyManage() {
  const { state } = useLocation()
  const [StoredTokens, CallAPI] = useAPI()
  const [activeSurvey, setActiveSurvey] = useState([])
  const [inactiveSurvey, setInActiveSurvey] = useState([])
  const [status, setStatus] = useState('none')
  const [survey_visible, set_survey_visible] = useState(false)

  const handleEndSurvey = async (survey_slug) => {
    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
    const axiosInstance = axios.create()
    CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/session/end_survey/`,
      'post',
      headers,
      { survey_slug: survey_slug },
      null,
    ).then((resObject) => {
      if (resObject.error === false) {
        const response = resObject.response
        const data = response?.data?.data
        console.log(data)
        alert('Survey Ended successfully')
      } else {
        alert(resObject.errorMessage.message)
      }
    })
  }
  //   const navigate = useNavigate()
  useEffect(() => {
    console.log(state.lecture_slug)
    if (state.lecture_slug) {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      CallAPI(
        StoredTokens,
        axiosInstance,
        `/manage/session/get_survey_details/${state.lecture_slug}`,
        'get',
        headers,
        { lecture_slug: state.lecture_slug },
        null,
      ).then((resObject) => {
        if (resObject.error === false) {
          const response = resObject.response
          const data = response?.data?.data
          console.log(data)
          if (data) {
            data.map((item) => {
              if (item.active === true) {
                // console.log(item)

                setActiveSurvey((activeSurvey) => [...activeSurvey, item])
              } else {
                setInActiveSurvey((inactiveSurvey) => [...inactiveSurvey, item])
              }
            })
          }
        } else {
          alert(resObject.errorMessage.message)
        }
      })
    }
  }, [])

  //   useEffect(() => {
  //     console.log(activeSurvey)
  //     console.log(inactiveSurvey)
  //   }, [activeSurvey, inactiveSurvey])

  return (
    <>
      <div className="mb-3">
      <CButton onClick={() => set_survey_visible(true)} className='mb-3 bg-gray-800'>Create Survey</CButton>

        <select
          className="form-select"
          aria-label="Default select example"
          required
          id="survey_state"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="none">....</option>
          <option value="active">Active</option>    
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <CRow className="mb-3">
        <CCol className="w-100">
          <div key={''}>
            <CAlert
              className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center mb-2"
              color="primary"
              visible=""
            >
              Surveys
            </CAlert>
            <div key="" className="d-flex justify-content-center w-100">
              <CRow className="flex-column w-100" style={{ padding: '0' }}>
                <CCol className="d-flex align-items-center flex-column w-100" key="">
                  <div className="w-100 rounded-0 border-0">
                    <div className="" style={{ paddingBottom: '0px' }}>
                      <div className="justify-content-center w-100">
                        <CToast key="" autohide={false} visible={true} className="mb-3 mt-3 w-100">
                          <CToastHeader className="d-flex flex-wrap justify-content-sm-between justify-content-center mx-2">
                            <div className={`w-100 fw-bold text-center`}>
                              <div>
                                <CCol className="text-sm-start text-center col-12 col-sm-4 col-lg-4 col-md-4">
                                  {status !== 'none'
                                    ? status === 'active'
                                      ? 'Active Surveys'
                                      : 'Inactive Surveys'
                                    : null}
                                </CCol>
                              </div>
                            </div>
                          </CToastHeader>

                          {status === 'none' && (
                            <div className="d-flex w-100 justify-content-center">
                              <div className="alert alert-warning w-75 my-2 text-center">
                                <span className="">No Active Surveys</span>
                              </div>
                            </div>
                          )}

                          {status === 'active' ? (
                            activeSurvey.length > 0 ? (
                              activeSurvey.map((item, index) => (
                                <CToastBody
                                  className="flex-row flex-wrap justify-content-center bg-slate-200"
                                  key={index}
                                >
                                  <div className="w-100 fw-bold text-center text-sm-start">
                                    <div>
                                      <small className="mx-2 my-2 text-xl block">
                                        {item.title}
                                      </small>
                                      <small className="mx-2 my-2 text-xs flex items-center gap-2 text-gray-700">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={16}
                                          height={16}
                                          fill="currentColor"
                                          className="bi bi-check2-circle"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 1 0 0 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 1 1 0-11 0" />
                                          <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                                        </svg>
                                        Select One
                                      </small>
                                    </div>
                                    <hr className="w-100 my-2" />
                                  </div>
                                  <div className="w-100">
                                    {item.options.map((option, index) => (
                                      <div key={index} className="my-2">
                                        <input
                                          type="radio"
                                          name={`survey-${item.id}`}
                                          value={option.option}
                                          id={`option-${item.id}-${index}`}
                                          className="mr-2"
                                        />
                                        <label
                                          htmlFor={`option-${item.id}-${index}`}
                                          className="text-blue-700 font-bold text-sm p-2"
                                        >
                                          {option.option}
                                        </label>
                                        <span className="ml-2 text-gray-500/60 font-bold">
                                          ({option.student_count} votes)
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <hr className="w-100 my-2" />
                                  <div className="flex-initial py-3 w-full">
                                    <button
                                      className="w-full justify-center flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-slate-800 rounded-md focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out hover:bg-red-500"
                                      type="submit"
                                      onClick={() => handleEndSurvey(item.slug)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        width="26px"
                                        height="26px"
                                      >
                                        <path
                                          fill="#f44336"
                                          d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                                        />
                                        <path
                                          fill="#fff"
                                          d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
                                        />
                                        <path
                                          fill="#fff"
                                          d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
                                        />
                                      </svg>
                                      <span className="pl-2">End Survey</span>
                                    </button>
                                  </div>
                                </CToastBody>
                              ))
                            ) : (
                              <div className="alert alert-warning w-75 my-2 text-center">
                                <span>No Active Surveys</span>
                              </div>
                            )
                          ) : null}

                          {status === 'inactive' ? (
                            inactiveSurvey.length > 0 ? (
                              inactiveSurvey.map((item, index) => (
                                <CToastBody
                                  className="flex-row flex-wrap justify-content-center bg-gray-200 opacity-50 cursor-not-allowed"
                                  key={index}
                                >
                                  <div className="w-100 fw-bold text-center text-sm-start">
                                    <div>
                                      <small className="mx-2 my-2 text-lg block text-gray-600">
                                        {index+1} {item.title}
                                      </small>
                                    </div>
                                    <hr className="w-100 my-2" />
                                  </div>
                                  <div className="w-100">
                                    {item.options.map((option, index) => (
                                      <div key={index} className="my-2">
                                        <label
                                          htmlFor={`option-${item.id}-${index}`}
                                          className="text-gray-500 font-bold text-sm p-2"
                                        >
                                          {option.option}
                                        </label>
                                        <span className="ml-2 text-gray-400 font-bold">
                                          ({option.student_count} votes)
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <hr className="w-100 my-2" />
                                </CToastBody>
                              ))
                            ) : (
                              <div className="alert alert-warning w-75 my-2 text-center opacity-50 cursor-not-allowed">
                                <span>No Inactive Surveys</span>
                              </div>
                            )
                          ) : null}
                        </CToast>
                      </div>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </div>
          </div>
        </CCol>
        <CreateSurvey survey_visible={survey_visible} set_survey_visible={set_survey_visible}></CreateSurvey>
      </CRow>
    </>
  )
}   

export default SurveyManage
