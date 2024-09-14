import React, { useEffect, useState,useRef } from 'react'
import useAPI from 'src/global_function/useApi'
import axios from 'axios'

function UploadResult() {
  const [StoredTokens, CallAPI] = useAPI()
  const [subjects, SetSubjects] = useState([])
  const [fileInput,setFileInput] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [remarks, setRemarks] = useState('')
  const [marksOutOf,setMarksOutOf] = useState(null)  
  

  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  }
  const axiosInstance = axios.create()

  const get_subjects = async () => {
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
    } else {
      alert(response_obj.errorMessage.message)
    }
  }
  useEffect(() => {
    get_subjects()
  }, [])

  const submit_results = async () => {
    if(!fileInput){
        alert("Please select a valid file!!")
        return;
    }
    if(selectedSubject == ''){
        alert("Please select a subject!!")
        return;
    }
    if(remarks == '') {
        alert("Please add some remarks!!")
        return;
    }
    if(marksOutOf == null || marksOutOf == '') {
        alert("Please add total marks!!")
        return;
    }
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        const formData = new FormData();
        formData.append('subject_slug', selectedSubject);        
        formData.append('remarks', remarks);        
        formData.append('total_marks', marksOutOf);
        formData.append('result_csv', fileInput); 
        CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/notifications/upload_results/',
            'post',
            headers,
            formData,
            null,
          ).then(res => {
            if (res.error === false) {
                alert(res.response.data.message)
            }
          })    
  }  
  

  return (
    <div>
      {subjects.length > 0 && (
        <div className="mb-3">
          <label className="form-label">Select A Subject</label>
          <select
            className="form-select"
            aria-label="Default select example"
            required
            onChange={(e) => {
              setSelectedSubject(e.target.value)
            }}
          >
            <option value="">....</option>
            {subjects &&
              subjects.map((item, index) => (
                <option key={index} value={item.slug}>
                  {item.subject_name}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className="mb-3">
          <label className="form-label">Total marks</label>
          <input type='number' min={0} className='form-control' onChange={(e) => {setMarksOutOf(e.target.value)}} />
        </div>
      <div className="mb-3">
          <label className="form-label">Remarks</label>
          <textarea className='form-control' onChange={(e) => {setRemarks(e.target.value)}}></textarea>
        </div>
      <div className="flex-1 items-center w-full mx-auto space-y-4 sm:flex sm:space-y-0">
        <div className="relative w-full">
          <div className="items-center justify-center mx-auto z-20 w-full">
            <label
              className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-none appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
              id="drop"
            >
              <span className="flex items-center justify-center flex-col">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="font-medium text-gray-600">
                  Drop files to Attach, or
                  <span className="text-blue-600 underline ml-[4px]">browse</span>
                </span>
                <span className="font-medium text-gray-600">{fileInput ? fileInput.name : 'No File Selected'}</span>
              </span>
              <input
                type="file"                
                className="absolute opacity-0 h-full w-full  cursor-pointer"
                accept=".csv"
                id="input"
                onChange={(e) => {setFileInput(e.target.files[0])}}
              />
            </label>
          </div>
        </div>
      </div>
            <button  className='w-full btn btn-success rounded-none' onClick={() => {submit_results()}}>Submit</button>
    </div>
  )
}

export default UploadResult
