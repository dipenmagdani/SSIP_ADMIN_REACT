import React, { useState, useRef, useEffect } from 'react'
import {
    COffcanvas,
    COffcanvasBody,
    CAlert,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import { Controller, useForm } from "react-hook-form"
import useAPI from 'src/global_function/useApi'
import axios from 'axios'


const Sessionmanage = ({ visible, setVisible, sechedule, lectureConfigs, schedule_list }) => {


    return (
        <>
            <COffcanvas
                className="card w-100"
                placement="end"
                visible={visible}
                onHide={() => setVisible(false)}
                data-coreui-backdrop="static"
            >
                <CAlert
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
                </CAlert>
                <COffcanvasBody>
                    <CRow className='w-100 flex-1 flex-col'>
                        <CCol>
                            {/* shows the details of the current lecture along with schedule */}
                            <CCard>
                                <CCardHeader>
                                    Lecture Details
                                </CCardHeader>
                                <CCardBody>
                                    {/* all the details of the session are display here */}
                                    <CRow className='w-100 flex-1 justify-center'>
                                        <CCol className='text-center'>
                                            <p>Time</p>
                                            <p>10:30 | 11:30</p>
                                        </CCol>
                                        <CCol className='text-center'>
                                            <p>Subject</p>
                                            <p>Environment Engineering</p>
                                        </CCol>
                                        <CCol className='text-center'>
                                            <p>Lecture Type</p>
                                            <p>Environment Engineering</p>
                                        </CCol>
                                        <CCol className='text-center'></CCol>
                                        <CCol>

                                            <p>Classroom</p>
                                            <p>Upnisad Hall</p>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol>
                            {/* table that shows the student which are in room along with it's attendace status */}
                            <CRow>
                                <CCol xs>
                                    <CCard className="mb-4">
                                        <CCardHeader>
                                            <strong>Attedence</strong>
                                        </CCardHeader>
                                        <CCardBody>
                                        <CRow className='w-100 flex-col'>
                                            <CCol className='col-12'>
                                            <CTable align="middle" className="mb-0 border text-center" hover responsive>
                                                <CTableHead color="light">
                                                    <CTableRow>
                                                        <CTableHeaderCell>SR. NO</CTableHeaderCell>
                                                        <CTableHeaderCell>Enrollment No</CTableHeaderCell>
                                                        <CTableHeaderCell>Student Name</CTableHeaderCell>
                                                        <CTableHeaderCell>Batch</CTableHeaderCell>
                                                        <CTableHeaderCell>attendace Status</CTableHeaderCell>
                                                    </CTableRow>
                                                </CTableHead>
                                                {/* <CTableBody>
                                                    {semester.map((item, index) => (
                                                        <CTableRow v-for="item in tableItems" key={index} onClick={() => { chageSteps('division'); set_semester_slug(item.slug); }}>
                                                            <CTableDataCell>
                                                                <div>{item.no}</div>
                                                            </CTableDataCell>

                                                            <CTableDataCell>
                                                                <div>
                                                                    {item.status ? (<div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                                                    </svg>{ }
                                                                    </div>) : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                                                                    </svg>}
                                                                </div>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    ))}
                                                </CTableBody> */}
                                            </CTable>
                                            </CCol>
                                            <CCol className='col-12'>
                                                <CRow className='justify-end'>
                                                    <CCol>
                                                       <CRow className='flex-col'>
                                                            <CCol>
                                                                <div>
                                                                    <span>Total Student : 100</span>
                                                                </div>
                                                            </CCol>
                                                            <CCol>
                                                            <div>
                                                                    <span>Present Student : 90</span>
                                                                </div>
                                                            </CCol>
                                                            <CCol>
                                                            <div>
                                                                    <span>Absent : 10</span>
                                                                </div>
                                                            </CCol>
                                                        </CRow> 
                                                    </CCol>
                                                </CRow>
                                            </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                </COffcanvasBody>
            </COffcanvas>
        </>
    )
}

export default Sessionmanage