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

export const AddEvent = ({ visible, setVisible,branches,setActiveEvents }) => {
  const [eventTitle,setEventTitle] = useState('')
  const [eventDescription,setEventDescription] = useState('')
  const [selectedBranches,setSelectedBranches] = useState([])

const handleSelectedBranchChange = (event) => {    
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedBranches(selectedOptions);
  };

  const [StoredTokens, CallAPI] = useAPI()
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
  }
  const axiosInstance = axios.create()

const create_event = async(e) => {
  e.preventDefault()
  let body = {
    title:eventTitle,
    description:eventDescription,
    branches:selectedBranches
  }
  CallAPI(
    StoredTokens,
    axiosInstance,
    '/manage/notifications/add_event/',
    'post',
    headers,
    body,
    null,
  ).then((res) => {
    if (res.error) {
      alert(res.errorMessage.message)
    } else {
          let event = res.response.data.data
          setActiveEvents(prevArray => [event,...prevArray])
          setVisible(false)
    }
  })
}

  return (    
    <COffcanvas    
    placement="end"
    visible={visible}
    onHide={() => setVisible(false)}
    data-coreui-backdrop="static"
    className="card w-100 p-4" >
      <COffcanvasBody>
        <CCard className="shadow-lg rounded-lg border border-gray-200">
          <CCardHeader className="bg-[#c2bcf4] text-xl py-2 rounded-t-lg">Add Event</CCardHeader>
          <CCardBody className="p-6">
            <form className="space-y-4" autoComplete="off" onSubmit={create_event}>
              {/* Survey Title */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Title Of Event</label>
                <input
                  type="text"
                  className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                  required      
                  onChange={(e) => {setEventTitle(e.target.value)}}
                />
              </div>              
              {/* Survey Description */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Description Of Event</label>
                <textarea
                rows={4}
                  type="textarea"
                  className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                  required     
                  onChange={(e) => {setEventDescription(e.target.value)}}
                />
              </div>  
              {/* Select Branch */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Select Branch</label>                
                <CFormSelect
                    aria-label="Select Branch"    
                    multiple      
                    value={selectedBranches}          
                    onChange={handleSelectedBranchChange}
                  >                    
                    {branches.map((branch,index) => (
                      <option value={branch.slug} key={index}>{branch.branch_name}</option>
                    ))}
                  </CFormSelect>                
              </div>
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

export default AddEvent
