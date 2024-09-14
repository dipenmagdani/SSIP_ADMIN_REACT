import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'
import { CCardHeader, CCard, CCardBody, CCardFooter } from '@coreui/react'
import AddEvent from './AddEvent'

function Events() {
  const [visible, setVisible] = useState(false)
  const [ActiveEvents, setActiveEvents] = useState([])
  const [PastEvents, setPastEvents] = useState([])
  const [selectedEventType, setSelectedEventType] = useState('active')
  const [StoredTokens, CallAPI] = useAPI()
  const [branches,setBranches] = useState([])
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  }
  const axiosInstance = axios.create()

  const get_branches = async () => {
    CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/get_active_branches_for_superadmin',
      'get',
      headers,
      null,
      null,
    ).then((res) => {
      if (res.error) {
        alert(res.errorMessage.message)
      } else {
        setBranches(res?.response?.data?.data)   
      }
    })
  }
  const end_event = async (event_slug) => {
    CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/notifications/end_event',
      'post',
      headers,
      {event_slug:event_slug},
      null,
    ).then((res) => {
      if (res.error) {
        alert(res.errorMessage.message)
      } else {
        alert(res.response.data.message)
        setActiveEvents(ActiveEvents.filter((event) => {
          setPastEvents(prevArray => [event,...prevArray])
          return event.slug != event_slug
        }))        
      }
    })
  }
  const get_events = async () => {
    CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/notifications/get_events',
      'get',
      headers,
      null,
      null,
    ).then((res) => {
      if (res.error) {
        alert(res.errorMessage.message)
      } else {        
        let events = res.response.data.data
        setActiveEvents(events.filter((event) => event.status == true))
        setPastEvents(events.filter((event) => event.status == false))                
      }
    })
  }

  useEffect(() => {
    get_events()
    get_branches()
  }, [])

  return (
    <div>
      <div className="mt-3">
        <select
          className="form-select"
          aria-label="Default select example"
          onChange={(e) => {
            setSelectedEventType(e.target.value)
          }}
        >
          <option value="active">Active Events</option>
          <option value="past">Past Events</option>
        </select>
      </div>
      <div className="mt-4">
        {selectedEventType == 'past' ? (
          PastEvents.length > 0 ? (
            PastEvents.map((event, index) => (
              <CCard className="mb-4" key={index}>
                <CCardHeader>
                  <h5 className="mb-2 text-2xl font-semibold tracking-tight text-dark">
                    {event.title}
                  </h5>
                </CCardHeader>
                <CCardBody>
                  <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                    {event.description}
                  </p>
                </CCardBody>
                <CCardFooter>
                  <p className="mb-3 font-normal text-gray-800 dark:text-gray-800">
                    <p className="mb-1 font-bold text-gray-800 dark:text-gray-800">Branches</p>
                    {event.branches.map((branch, index) => branch.branch_name).join(', ')}
                  </p>
                </CCardFooter>
              </CCard>
            ))
          ) : (
            <div className="d-flex w-100 justify-content-center">
              <div className="alert alert-warning w-full my-2 text-center">
                <span className="">No Past Events</span>
              </div>
            </div>
          )
        ) : ActiveEvents.length > 0 ? (
          ActiveEvents.map((event, index) => (
            <CCard className="mb-4" key={index}>
              <CCardHeader>
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-dark">
                  {event.title}
                </h5>
              </CCardHeader>
              <CCardBody>
                <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                  {event.description}
                </p>
              </CCardBody>
              <CCardFooter>
                <p className="mb-3 font-normal text-gray-800 dark:text-gray-800">
                  <p className="mb-1 font-bold text-gray-800 dark:text-gray-800">Branches</p>
                  {event.branches.map((branch, index) => branch.branch_name).join(', ')}
                </p>
              </CCardFooter>
              <button className='w-full btn btn-outline-danger rounded-none mt-2' onClick={() => {end_event(event.slug)}}>Event Event</button>
            </CCard>
          ))
        ) : (
          <div className="d-flex w-100 justify-content-center">
            <div className="alert alert-warning w-full my-2 text-center">
              <span className="">No Active Events</span>
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 right-0 w-16 h-16 mr-12 mb-8 cursor-pointer" id="box_btn" onClick={() => {setVisible(true)}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={60}
          height={60}
          fill="currentColor"
          className="bi bi-plus-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
        </svg>
      </div>
      {branches.length > 0 && <AddEvent visible={visible} setVisible={setVisible} branches={branches} setActiveEvents={setActiveEvents} />}
    </div>
  )
}

export default Events
