import React, { useEffect, useState } from 'react'
import {
COffcanvas,
  COffcanvasBody,  
  CCard,
  CCardBody,
  CFormSelect,
  CCardHeader,
} from '@coreui/react'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'

export const AddSurvey = ({ visible, setVisible,setActiveSurveys }) => {
  const [StoredTokens, CallAPI] = useAPI()
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState('__all__')
  const [selectedDivision, setSelectedDivision] = useState('__all__')
  const [selectedBatch, setSelectedBatch] = useState('__all__')
  const [numberOfOptions, setNumberOfOptions] = useState(2)
  const [optionsValues,setOptionValues] = useState({})  
  const [surveyTitle,setSurveyTitle] = useState('')
  

  const [branches, setBranches] = useState([])
  const [semesters, setSemesters] = useState([])
  const [division, setDivision] = useState([])
  const [batches, setBatches] = useState([])

  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  }
  const axiosInstance = axios.create()

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    let body = {
      "survey_title":surveyTitle,
      "type":"mcq",        
      "branch_slug":selectedBranch,
      "semester_slug":selectedSemester,
      "division_slug":selectedDivision,
      "batch_slug":selectedBatch,
      "options":Object.values(optionsValues)
  }  
    let response_obj = await CallAPI(StoredTokens,axiosInstance,'/manage/additional_features/generate_survey_for_a_lecture/','post',headers,body,null)
    if (response_obj.error == false) {
      
      let survey = response_obj?.response?.data?.data
      setActiveSurveys(prevArray => [...prevArray,survey])
      setVisible(false)
    } else {  
      alert(response_obj.errorMessage.message)    
    }
  }

  useEffect(() => {
    if (selectedBranch) {
      handleSemester(selectedBranch)
    } else {
      setSelectedSemester('__all__')
    }
  }, [selectedBranch])

  useEffect(() => {
    if (selectedSemester !== '__all__') {
      handleDivision(selectedSemester)
    } else {
      setSelectedDivision('__all__')
    }
  }, [selectedSemester])

  useEffect(() => {
    if (selectedDivision !== '__all__') {
      handleBatches(selectedDivision)
    } else {
      setSelectedBatch('__all__')
    }
  }, [selectedDivision])

  const handleBranch = async () => {
    let a = await CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_branches_of_teacher',
      'get',
      headers,
      null,
      null,
    )
    if (!1 === a.error) {
      let e = a.response,
        n = e.data.data
      setBranches(n)
    }
  }

  const handleSemester = async (e) => {
    let a = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/get_semesters_from_branch/${e}`,
      'get',
      headers,
      null,
      null,
    )
    if (!1 === a.error) {
      let t = a?.response,
        l = t?.data?.data
      console.log(l), setSemesters(l)
    }
  }

  const handleDivision = async (e) => {
    let a = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/get_divisons_from_semester/${e}`,
      'get',
      headers,
      null,
      null,
    )
    if (!1 === a.error) {
      let n = a?.response,
        s = n?.data?.data
      setDivision(s)
    }
  }

  const handleBatches = async (a) => {
    let e = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/get_batches_from_divison/${a}`,
      'get',
      headers,
      null,
      null,
    )
    if (!1 === e.error) {
      let t = e?.response,l = t?.data?.data
      setBatches(l)
    }
  }

  useEffect(() => {
    handleBranch()
  }, [])

  return (    
    <COffcanvas    
    placement="end"
    visible={visible}
    onHide={() => setVisible(false)}
    data-coreui-backdrop="static"
    className="card w-50 p-4" >
      <COffcanvasBody>
        <CCard className="shadow-lg rounded-lg border border-gray-200">
          <CCardHeader className="bg-[#c2bcf4] text-xl py-2 rounded-t-lg">Add Survey</CCardHeader>
          <CCardBody className="p-6">
            <form className="space-y-4" autoComplete="off" onSubmit={handleFormSubmit}>
              {/* Survey Title */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Title of Survey</label>
                <input
                  type="text"
                  className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                  required
                  onChange={(e) => {setSurveyTitle(e.target.value)}}
                />
              </div>

              {/* Number of Options */}
              <div className="mb-2">
                <div className="flex items-center gap-4">
                <label className="text-lg font-semibold">Manage Options</label>
                  <button
                    id="decrement-btn"
                    className="flex justify-center items-center w-6 h-6 rounded-full text-white focus:outline-none bg-gray-400 hover:bg-gray-500"
                    onClick={() => {numberOfOptions > 2 ? setNumberOfOptions(numberOfOptions - 1) : null}}
                    type='button'
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span id="counter" className="text-2xl font-bold mx-4">
                    {numberOfOptions}
                  </span>
                  <button
                    id="increment-btn"
                    className="flex justify-center items-center w-6 h-6 rounded-full text-white focus:outline-none bg-indigo-500 hover:bg-indigo-600"
                    onClick={() => {setNumberOfOptions(numberOfOptions + 1)}}
                    type='button'
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v12M6 12h12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mx-2">
                  {[...Array(numberOfOptions)].map((_, i) => (
                    <div className="mb-3 focus:border-yellow-500" key={i}>
                      <label className="form-label">Option {i + 1}</label>
                      <input
                        type="text"
                        className="form-control focus:border-yellow-500"
                        required
                        onChange={(e) => {setOptionValues((prevState) => ({...prevState,[`option_${i}`]: e.target.value}))}}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Branch */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Select Branch</label>                
                <CFormSelect
                    aria-label="Select Branch"
                    onChange={(e) => {
                      e.target.value !== '' && setSelectedBranch(e.target.value)
                    }}
                  >   
                    <option value="">Select Branch</option>                 
                    {branches.map((item, index) => (
                      <option key={index} value={item.slug}>
                        {item.branch_name}
                      </option>
                    ))}
                  </CFormSelect>                
              </div>

              {/* Select Semester */}
              {selectedBranch && (
                <div className="mb-4">
                <label className="form-label text-lg font-semibold">Select Semester</label>                
                  <CFormSelect                    
                    onChange={(e) => {
                      setSelectedSemester(e.target.value)
                    }}
                  >   
                    <option value="__all__">Select All</option>                 
                    {semesters.map((item, index) => (
                      <option key={index} value={item.slug}>
                        {item.no}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              )}

              {selectedSemester !== '__all__' && (
                <div className="mb-4">
                <label className="form-label text-lg font-semibold">Select Division</label>                
                  <CFormSelect                    
                    onChange={(e) => {
                      setSelectedDivision(e.target.value)
                    }}
                  >   
                    <option value="__all__">Select All</option>                 
                    {division.map((item, index) => (
                      <option key={index} value={item.slug}>
                        {item.division_name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              )}

              {/* Select Batch */}
              {selectedDivision !== '__all__' && (
                <div className="mb-4">

                <label className="form-label text-lg font-semibold">Select Batch</label>                
                  <CFormSelect                    
                    onChange={(e) => {
                      setSelectedBatch(e.target.value)
                    }}
                  >   
                    <option value="__all__">Select All</option>                 
                    {batches.map((item, index) => (
                      <option key={index} value={item.slug}>
                        {item.batch_name}
                      </option>
                    ))}
                  </CFormSelect>                
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"                
                className="btn btn-dark text-black rounded-md px-4 py-2 form-control"
              >
                Submit
              </button>
              <button
                type="button" 
                className="btn btn-danger text-black rounded-md px-4 py-2 form-control"
                onClick={() => {setVisible(false)}}
              >
                Cancel
              </button>
            </form>
          </CCardBody>
        </CCard>
      </COffcanvasBody>
    </COffcanvas>
  )
}

export default AddSurvey
