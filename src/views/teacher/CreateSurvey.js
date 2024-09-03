import React, { useEffect } from 'react'
import { useState } from 'react'
import {
    COffcanvas,  
    COffcanvasBody,  
    CAlert,
  } from '@coreui/react'
  import { useForm } from "react-hook-form"
  import useAPI from 'src/global_function/useApi'
  import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import { render } from '@testing-library/react'

export const CreateSurvey = ({survey_visible,set_survey_visible}) => {
    const { register, handleSubmit } = useForm();
    const [numberOfOptions, setNumberOfOptions] = useState(1)

    useEffect(() => {
        console.log(numberOfOptions)
    },[numberOfOptions])
    const handleFormSubmit = () => {

    }

    const options = [];
    for (let i = 0; i < numberOfOptions; i++) {
      options.push(
        <div className="mb-3" key={i}>
          <label className="form-label">Option {i + 1}</label>
          <input type="text" className="form-control" required />
        </div>
      );
    }

  return (
    <COffcanvas
    className="card w-100"
    placement="end"
    visible={survey_visible}
    onHide={() => set_survey_visible(false)}
    data-coreui-backdrop="static"
  >
    {/* <CAlert
      color="success"
      visible={true}
      className="justify-content-between align-items-center d-flex"
    >
      {sechedule.day.toUpperCase()}
      <svg
        onClick={() => setVisible(false)}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-x-lg"
        viewBox="0 0 16 16"
      >
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
      </svg>
    </CAlert> */}
    <COffcanvasBody>
      <form className="container" onSubmit={handleSubmit(handleFormSubmit)} >
        <div className="mb-3">
          <label className="form-label">Title of Survey</label>
          <input type="text" className="form-control" required  {...register("survey_title")}/>
        </div>
     
        <div className="mb-3">
          <label className="form-label">Enter Number of Options</label>
          <input type="number" className="form-control" onChange={(e) => setNumberOfOptions(e.target.value)} required/>
        </div>
        {options}
          <button type="submit" className="form-control btn-outline-success btn mb-3">
            Submit
          </button>                        
        <button type="button" className="form-control btn-outline-success btn" >
            Clear
        </button>            
      </form>
    </COffcanvasBody>
  </COffcanvas>
  )
}
