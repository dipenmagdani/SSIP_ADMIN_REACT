import React, { useEffect, useState } from 'react'
import { CAlert, CToastBody } from '@coreui/react'
import AddSurvey from './AddSurvey'
import AddSurveyButton from './AddSurveyButton'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'
import SurveyDisplay from './SurveyDisplay'

export const ManageSurveys = () => {
  const [visible, setVisible] = useState(false)
  const [ActiveSurveys, setActiveSurveys] = useState([])
  const [InactiveSurveys, setInactiveSurveys] = useState([])
  const [viewingSurveys, setViewingSurveys] = useState('active')
  const [StoredTokens, CallAPI] = useAPI()
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  }
  const axiosInstance = axios.create()

  useEffect(() => {
    CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/additional_features/get_surveys_of_the_teacher',
      'get',
      headers,
      null,
      null,
    ).then((res) => {
      if (res.error) {
        alert(res.errorMessage.message)
      } else {
        let surveys = res?.response?.data?.data
        setActiveSurveys(surveys.filter((survey) => survey.active == true))
        setInactiveSurveys(surveys.filter((survey) => survey.active == false))
      }
    })
  }, [])

  const endSurvey = async (survey_slug) => {
    let body = {survey_slug:survey_slug}
    console.log(survey_slug);
    CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/additional_features/end_survey/',
      'post',
      headers,
      body,
      null,
    ).then((res) => {
      if (res.error) {
        alert(res.errorMessage.message)
      } else {        
        setActiveSurveys(ActiveSurveys.filter((survey) => {
          setInactiveSurveys(prevArray => [...prevArray,survey])
          return survey.slug != survey_slug
        }))        
      }
    })
  }

  return (
    <div className="mt-2">
      <div className="mb-3">
        <select
          className="form-select"
          aria-label="Default select example"
          required
          onChange={(e) => {
            viewingSurveys == 'active' ? setViewingSurveys('inactive') : setViewingSurveys('active')
          }}
        >
          <option value="active">Active Surveys</option>
          <option value="inactive">Inactive Surveys</option>
        </select>
      </div>
      <div>
        {viewingSurveys === 'active' ? (
          <>
          <div className='flex flex-col gap-4 overflow-y-scroll'>
            {ActiveSurveys.length > 0 ? (
              ActiveSurveys.map((item, index) => (
                <SurveyDisplay item={item} key={index} active={true} endSurvey={endSurvey}/>
              ))
            ) : (
              <div className="alert alert-warning w-full my-2 text-center">
                <span>No Active Surveys</span>
              </div>
            )}
          </div>
          </>
        ) : (
          <>            
            <div className='flex flex-col gap-4 overflow-y-scroll'>
            {InactiveSurveys.length > 0 ? (
              InactiveSurveys.map((item, index) => (
                <SurveyDisplay item={item} key={index} active={false}/>
              ))
            ) : (
              <div className="alert alert-warning w-75 my-2 text-center">
                <span>No Inactive Surveys</span>
              </div>
            )}
            </div>
          </>
        )}
      </div>
      <AddSurveyButton setVisible={setVisible} />
      <AddSurvey visible={visible} setVisible={setVisible} setActiveSurveys={setActiveSurveys} />
    </div>
  )
}

export default ManageSurveys
