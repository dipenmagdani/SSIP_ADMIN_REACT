import React from 'react'
import { CToastBody } from '@coreui/react'

function SurveyDisplay({item,active,endSurvey}) {
  return (
    <CToastBody
    className="flex-row px-3 flex-wrap justify-content-center bg-slate-200 border border-black shadow-md"
  >
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
    {active && (
      <>
      <hr className="w-100 my-2" />
      <div className="flex-initial py-3 w-full">
      <button
        className="w-full justify-center flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-slate-800 rounded-md focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out hover:bg-red-500"
        type="submit"
        onClick={() => {endSurvey(item.slug)}}
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
      </>)}
    
  </CToastBody>
  )
}

export default SurveyDisplay