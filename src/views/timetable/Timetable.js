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
  CCollapse,
  CHeader
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
import SetLecture from './SetLecture'
import { useNavigate } from 'react-router-dom'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
const Timetable = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const [visible, setVisible] = useState(false)
  const { accessToken, refreshToken, currentBatch } = state
  const [Semesters, setSemesters] = useState([])
  const [currentSelectSemester, setcurrentSelectSemester] = useState(null)
  const [timeTable, settimeTable] = useState([])
  const [lectureObj, setLectureObj] = useState(null)
  const [scheduleObj, setscheduleObj] = useState(null)
  const [update_timetabel, setupdate_timetable] = useState(0)

  const [visibleLectureToast, setVisibleLectureToast] = useState(false)

  const naivgate = useNavigate()
  useEffect(() => {
    if (currentBatch.slug) {
      load_semester(currentBatch.slug)
    }
  }, [currentBatch])
  const load_semester = async (batchslug) => {
    const header = {
      "Content-Type": "application/json",
      'ngrok-skip-browser-warning': true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_semesters`; let method = 'get'; let headers = header;
    let response_obj = await APIMiddleware(axiosInstance, endpoint, method, headers, null, { batch_slug: batchslug })
    if (response_obj.error == false) {
      let response = response_obj.response
      setSemesters(response.data.data)
    } else {
      console.log(response_obj.error)
    }
  }
  const load_time_tale = async () => {
    const header = {
      "Content-Type": "application/json",
      'ngrok-skip-browser-warning': true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/timetable/get_timetable`; let method = 'get'; let headers = header;
    let response_obj = await APIMiddleware(axiosInstance, endpoint, method, headers, null, { semester_slug: currentSelectSemester })
    if (response_obj.error == false) {
      let response = response_obj.response
      console.log(response)
      settimeTable(response.data.timetable)
      const setVisibleTost = {}
      response.data.timetable.schedules.map((item, index) => {
        item.lectures.map((lecture, index) => {
          setVisibleTost[lecture.slug] = false
        })
      })
      console.log(setVisibleTost);
      setVisibleLectureToast(setVisibleTost)
    } else {
      console.log(response_obj.error)
    }
  }
  useEffect(() => {
    if (currentSelectSemester) {
      load_time_tale()
    }
  }, [currentSelectSemester, update_timetabel])
  const editLecture = (lecture, schedule) => {
    console.log(lecture)
    console.log(schedule)
    setLectureObj(lecture)
    setscheduleObj(schedule)
  }
  const onMouseEnterHandel = (lecture_slug) => {
    console.log("enter");
    setVisibleLectureToast(prevState => ({
      ...prevState,
      [lecture_slug]: true
    }));
  }
  const onMouseLeaveHandel = (lecture_slug) => {
    setVisibleLectureToast(prevState => ({
      ...prevState,
      [lecture_slug]: false
    }));
  }
  return (
    <>
      <CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader>Semester</CCardHeader>
            <CCardBody>
              <CFormSelect
                aria-label="Default select example"
                onChange={(e) => {
                  setcurrentSelectSemester(e.target.value)
                }}
              >
                <option value="">Select Semester</option>
                {Semesters.map((item, index) => (
                  <option key={index} value={item.slug}>
                    Semester - {item.no}
                  </option>
                ))}
              </CFormSelect>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>TimeTable</CCardHeader>
            <CCardBody>
              <CRow className='flex-column'style={{padding:"0"}}> 
              <CCol className='mb-2 ml-2'>
                  <div className='row w-100 justify-content-between mb-2 border rounded p-2 text-white' style={{marginLeft:"2px",backgroundColor:"#321fdb"}}>
                    <CCol>
                      <div className='w-100 text-left' >Monday</div>
                    </CCol>
                    <CCol>
                      <div className='w-100 text-end'>
                        <div className='h-20'>
                        add Lecture
                        </div>
                      </div>
                    </CCol>
                  </div>
                  <CCollapse visible={true}>
                    <CCard className="">
                      <CCardBody>
                        <CRow className=''>
                          <CCol sm={12} md={12} lg={12}>
                            <CRow sm={12} md={12} lg={12} className='justify-content-center'>
                              <CCol sm={11} md={11} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardHeader>
                                    10:30 To 11:30
                                  </CCardHeader>
                                </CCard>
                              </CCol>
                              <CCol sm={12} md={12} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardHeader>
                                    10:30 To 11:30
                                  </CCardHeader>
                                </CCard>
                              </CCol>
                              <CCol sm={12} md={12} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardHeader>
                                    10:30 To 11:30
                                  </CCardHeader>
                                </CCard>
                              </CCol>
                              <CCol sm={12} md={12} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardBody>
                                    <div className='d-flex justify-content-between'>
                                      <div className=''>Subject Name</div>
                                      <div className=''>Lab/Lecture</div>
                                    </div>
                                    <div>
                                      <div>Time at classroom of fa</div>

                                    </div>
                                  </CCardBody>
                                </CCard>
                              </CCol>
                            </CRow>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CCollapse>
                </CCol>
                <CCol className='mb-2 ml-2'>
                  <div className='row w-100 justify-content-between mb-2 border rounded p-2 text-white' style={{marginLeft:"2px",backgroundColor:"#321fdb"}}>
                    <CCol>
                      <div className='w-100 text-left' >Monday</div>
                    </CCol>
                    <CCol>
                      <div className='w-100 text-end'>up/down</div>
                    </CCol>
                  </div>
                  <CCollapse visible={true}>
                    <CCard className="">
                      <CCardBody>
                        <CRow className=''>
                          <CCol sm={12} md={12} lg={12}>
                            <CRow sm={12} md={12} lg={12} className='justify-content-center'>
                              <CCol sm={11} md={11} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardHeader>
                                    10:30 To 11:30
                                  </CCardHeader>
                                </CCard>
                              </CCol>
                              <CCol sm={12} md={12} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardHeader>
                                    10:30 To 11:30
                                  </CCardHeader>
                                </CCard>
                              </CCol>
                              <CCol sm={12} md={12} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardHeader>
                                    10:30 To 11:30
                                  </CCardHeader>
                                </CCard>
                              </CCol>
                              <CCol sm={12} md={12} lg={12} className='mb-2'>
                                <CCard>
                                  <CCardBody>
                                    <div className='d-flex justify-content-between'>
                                      <div className=''>Subject Name</div>
                                      <div className=''>Lab/Lecture</div>
                                    </div>
                                    <div>
                                      <div>Time at classroom of fa</div>

                                    </div>
                                  </CCardBody>
                                </CCard>
                              </CCol>
                            </CRow>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CCollapse>
                </CCol>
              </CRow>






            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {lectureObj && scheduleObj ? (<SetLecture visible={visible} setupdate_timetable={setupdate_timetable} setVisible={setVisible} scheduleObj={scheduleObj} lectureObj={lectureObj} currentSelectSemester={currentSelectSemester} />) : null}
    </>
  )
}
export default Timetable