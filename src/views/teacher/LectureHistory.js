import React, { useEffect, useState } from 'react'
import { 
    CRow,
    CCol,
    CCardHeader,
    CCard,
    CCardBody
} from '@coreui/react'
import useAPI from 'src/global_function/useApi'
import axios from 'axios'
import '../../css/tailwind.css'

const LectureHistory = () => {
const [StoredTokens, CallAPI] = useAPI()
const [subjects,SetSubjects] = useState(null)
const load_subjects_of_teacher = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_subjects_of_teacher',
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      SetSubjects(response.data.data)      
    }
    else{
      alert(response_obj.errorMessage.message)
    }
  }
  const load_lectures = async (subject_slug) => {
    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        '/manage/get_lecture_sessions_for_teacher',
        'get',
        headers,
        null,
        {subject_slug:subject_slug},
      )
      if (response_obj.error === false) {
        const response = response_obj.response
        // SetSubjects(response.data.data)      
      }
      else{
        alert(response_obj.errorMessage.message)
      }
  }
  useEffect(() => {
    load_subjects_of_teacher()
  },[])
  return (
    <>
        <div className="mb-3">
              <label className="form-label">Select A Subject</label>
              <select className="form-select" aria-label="Default select example" required  onChange={(e) => {load_lectures(e.target.value)}}>
                <option value="">....</option>
                {subjects && subjects.map((item,index) => (
                    <option key={index} value={item.slug}>{item.subject_name}</option>
                ))}               
              </select>
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
                <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-300"></div>
            </div>
        </div>
    </>
  )
}

export default LectureHistory