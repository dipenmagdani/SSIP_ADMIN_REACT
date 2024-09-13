import React,{useEffect, useState} from 'react'
import { CAlert } from '@coreui/react'
import useAPI from 'src/global_function/useApi'
import axios from 'axios'
import DisplaySurvey from './DisplaySurvey'

function SubmitSurvey() {
    const [StoredTokens, CallAPI] = useAPI()
    const axiosInstance = axios.create()
    const [Surveys,setSurveys] = useState([])
    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
    }
    useEffect(() => {
        CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/additional_features/get_surveys_of_the_student',
            'get',
            headers,
            null,
            null,
          ).then((res) => {
            if (res.error) {
              alert(res.errorMessage.message)
            } else {
              let surveys = res?.response?.data?.data
              setSurveys(surveys)
              console.log(surveys);
            }
          })
    }, [])

    const SubmitSurvey = async (survey_slug,option_slug) => {
        CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/additional_features/submit_survey/',
            'post',
            headers,
            {survey_slug:survey_slug,marked_option_slug:option_slug},
            null,
          ).then((res) => {
            if (res.error) {
              alert(res.errorMessage.message)
            } else {
                alert("Your response has been submitted!!")
            }
          })
    }
  return (
    <div>
         <CAlert
              className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center mb-2"
              color="primary"
              visible={true}
            >
              Active Surveys
            </CAlert>
            <div className='flex flex-col gap-4 overflow-y-scroll'>
            {Surveys.length > 0 ? (
                Surveys.map((item, index) => (
                <DisplaySurvey item={item} key={index} SubmitSurvey={SubmitSurvey}/>
              ))
            ) : (
              <div className="alert alert-warning w-full my-2 text-center">
                <span>No Inactive Surveys</span>
              </div>
            )}
            </div>
    </div>
  )
}

export default SubmitSurvey