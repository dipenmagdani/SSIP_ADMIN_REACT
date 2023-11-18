import React from 'react'
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardFooter,
  CCol,
  CRow,
} from '@coreui/react'

import axios from 'axios'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import FormControl from '../forms/form-control/FormControl'
import Select from '../forms/input-group/InputGroup'
import Validation from '../forms/validation/Validation'
import { jwtDecode } from "jwt-decode";
import { useContext , useEffect } from 'react'
import { Store } from 'src/views/forms/validation/store';
import base_url from 'src/base_url'
const Dashboard = () => {
  const [steps, setsteps] = useState('batch')
  const [Betchslug, setBetchslug] = useState("");
  const [batchCount, setbatchCount] = useState(0);
  const [semCount, setsemCount] = useState(0);
  const [subCount, setsubCount] = useState(0);
const [adminInfo, setadminInfo] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToke , refreshToken } = state

  const decodeToken= () => {
    // console.log(userInfo);
    const decoded = jwtDecode(accessToke);
    setadminInfo(decoded)
    console.log(decoded);
  }
  const getObjectCounts = () =>{
    const header = {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${accessToke}`,
      'ngrok-skip-browser-warning':true
    }
    axios.get(`${base_url}/manage/get_object_counts`,{headers:header})
    .then((response)=>{
        console.log(response);
        setbatchCount(response.data.batches)
        setsemCount(response.data.semesters)
        setsubCount(response.data.subjects)
        console.log(batchCount);
        console.log(semCount);
        console.log(subCount);
    })
    .catch((error)=>{
      console.log(error);
    })
  }
  
  
  useEffect(() => {
      decodeToken()
      getObjectCounts()
  }, []);
  
  const chageSteps = (currentStep) =>{
      setsteps(currentStep)
  }
  const progressExample = [
    { title: 'Batches', value: batchCount, nextStep:'batch'},
    { title: 'Semester', value: semCount, nextStep:'semester' },
    { title: 'Subjects', value: subCount, nextStep:'subject' },
  ]

  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <CButton style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => {chageSteps(item.nextStep)}}>
                  <div className="text-medium-emphasis">{item.title}</div>
                  <strong style={{ color: 'black' }}>
                    {item.value} {item.percent}
                  </strong>
                </CButton>
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      {(() => {
        
        switch (steps) {
          case 'batch':
            return <Validation chageSteps={chageSteps}  setSlug={setBetchslug} setBatchCout={setbatchCount}></Validation>
          case 'semester':
            return <FormControl chageSteps={chageSteps}  batchSlug={Betchslug}></FormControl>
          case 'subject':
            return <Select chageSteps={chageSteps} ></Select>
          default:
            console.log(steps)
        }
      })()}
    </>
  )
}

export default Dashboard
