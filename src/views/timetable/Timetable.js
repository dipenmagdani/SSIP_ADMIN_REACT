import React from 'react';
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CTableHead
} from '@coreui/react'

import axios from 'axios'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import FormControl from '../forms/form-control/FormControl'
import Select from '../forms/input-group/InputGroup'
import Validation from '../forms/validation/Validation'
import { useContext , useEffect } from 'react'
import { Store } from 'src/views/forms/validation/store';
import base_url from 'src/base_url'
import Breadcrumbnav from '../breadcrum/Breadcrumbnav';
import expireToken from 'src/global_function/unauthorizedToken';

const Timetable = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { accessToken,refreshToken, currentBatch } = state
    const [Semesters, setSemesters] = useState([]);
    const [currentSelectSemester, setcurrentSelectSemester] = useState(null);
    const [timeTable, settimeTable] = useState([]);
    useEffect(() => {
        if(currentBatch.slug){
          load_semester(currentBatch.slug)
        }  
    }, [currentBatch]);

    const load_semester = async (batchslug) =>{
    
    const header = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      'ngrok-skip-browser-warning': true
    }

    axios.get(`${base_url}/manage/get_semesters`, {
      params: { batch_slug: batchslug },
      headers: header
    })
      .then((response) => {
        setSemesters(response.data.data)
      })
      .catch((error) => {
        if(error.response.status === 401){
          expireToken(refreshToken,(error,result)=>{
            ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.access });
            ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.refresh });
          })
        }
      })
    }

    const load_time_tale = async () => {
      const header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': true
      }
      console.log(currentSelectSemester);
        axios.get(`${base_url}/manage/timetable/get_timetable`,{
          params: {semester_slug: currentSelectSemester},
          headers:header
        })
        .then((response)=>{
              console.log(response.data.timetable);
              settimeTable(response.data.timetable)
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    useEffect(()=>{
      if(currentSelectSemester){
          load_time_tale()
      }
    },[currentSelectSemester])

  return (
    <>
    <CRow className='mb-3'>
        <CCol>
        <CCard>
        <CCardHeader>
            Semester
        </CCardHeader>
        <CCardBody>
        <CFormSelect aria-label="Default select example" onChange={(e) => {setcurrentSelectSemester(e.target.value)}}>
        <option value="">Select Semester</option>
        {Semesters.map((item,index)=>(
                <option key={index} value={item.slug}>Semester - {item.no}</option>
            ))}
        </CFormSelect>
        </CCardBody>
    </CCard>
        </CCol>
    </CRow>
    
    <CRow>
        <CCol>
            <CCard>
                <CCardHeader>
                    TimeTable
                </CCardHeader>
                <CCardBody>
                <CTable align="middle" className="mb-0 border text-center" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Time / Days</CTableHeaderCell>
                    <CTableHeaderCell>10:30 - 11:30</CTableHeaderCell>
                    <CTableHeaderCell>11:30 - 12:30</CTableHeaderCell>
                    <CTableHeaderCell>1:00 - 2:00</CTableHeaderCell>
                    <CTableHeaderCell>2:00 - 3:00</CTableHeaderCell>
                    <CTableHeaderCell>3:15 - 4:15</CTableHeaderCell>
                    <CTableHeaderCell>4:15 - 5:15</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                      {
                        timeTable.schedules.length > 0 ? (timeTable.map((item,index)=>(
                          <CTableRow key={index}>
                            {item.schedules.map((schedule,index)=>(
                              <CTableHeaderCell key={index}>{schedule.day}</CTableHeaderCell>
                            )
                            )}
                              
                          </CTableRow>
                        ))
                      ):null}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
                </CCardBody>
            </CCard>
            
        </CCol>
    </CRow>
    </>
  );
}

export default Timetable;
