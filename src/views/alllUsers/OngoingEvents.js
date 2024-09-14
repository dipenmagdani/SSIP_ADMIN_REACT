import React,{ useContext, useState } from 'react'
import { Store } from "src/views/forms/validation/store";
import {CAlert,CCardHeader, CCard, CCardBody, CCardFooter } from '@coreui/react'

function OngoingEvents() {
    const { state } = useContext(Store);
const { notifications } = state
console.log(notifications);

  return (
    <>
     <CAlert
                    className="m-0 rounded-0 w-100 p-2 d-flex justify-content-between align-items-center mb-2"
                    color="primary"
                    visible={true}
                  >
                    Ongoing Events
                  </CAlert>
        {notifications.events.length > 0 ? notifications.events.map((event,index) => (
            <CCard className="my-4" key={index}>
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
        )) : <div className="d-flex w-100 justify-content-center">
            <div className="alert alert-warning w-full my-2 text-center">
              <span className="">No Active Events</span>
            </div>
          </div>}
    </>
  )
}

export default OngoingEvents