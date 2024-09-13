import React, { useState } from 'react'
import { CToastBody } from '@coreui/react'

function DisplaySurvey({ item,SubmitSurvey }) {
const [selectedOption,setSelectedOption] = useState(null)
  return (
    <CToastBody className="flex-row px-3 flex-wrap justify-content-center bg-slate-200">
      <div className="w-100 fw-bold text-center text-sm-start">
        <div>
          <small className="mx-2 my-2 text-xl block">{item.title}</small>
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
              name={`survey-${item.slug}`}
              value={option.slug}
              id={`option-${item.slug}-${index}`}
              className="mr-2"
              onChange={(e) => {setSelectedOption(e.target.value)}}
            />
            <label
              htmlFor={`option-${item.slug}-${index}`}
              className="text-blue-700 font-bold text-sm p-2"
            >
              {option.option}
            </label>
            <span className="ml-2 text-gray-500/60 font-bold">({option.student_count} votes)</span>
          </div>
        ))}
      </div>      
      <div className="flex-initial py-3 w-full">
      <button
        className="w-full justify-center flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-slate-800 rounded-md focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out hover:bg-green-500"
        type="submit" 
        onClick={() => {SubmitSurvey(item.slug,selectedOption)}}       
      >        
        <span className="pl-2">Submit Survey</span>
      </button>
    </div>
    </CToastBody>
  )
}

export default DisplaySurvey
