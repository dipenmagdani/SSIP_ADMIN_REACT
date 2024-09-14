import React, { useEffect, useState } from 'react'
import { CCard,CCardHeader,CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell,CButton,CRow,CCol, CCardBody } from '@coreui/react'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'

function SuperAdminDashboard() {
    const [StoredTokens, CallAPI] = useAPI()
    const header = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
    const axiosInstance = axios.create()
    const [branches,setBranches] = useState([])


    const load_branches = async () => {
        let endpoint = `/manage/get_active_branches_for_superadmin`
        let method = 'get'
        let headers = header
        let response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, headers, null, null)
        if (response_obj.error == false) {
        let branches = response_obj?.response?.data?.data
        setBranches(branches)
        } else {
            alert(response_obj.errorMessage.message)
        }
    }
    useEffect(() => {
        load_branches()
    }, [])
    
  return (
    <div>
        <CCard className="mb-4">
        <CCardBody>
              <CCol className="flex items-center">
                  <div className="text-medium-emphasis text-xl">L.D. College Of Engineering</div>                                  
              </CCol>          
        </CCardBody>        
      </CCard>     
    <CCard className="mb-4">
            <CCardHeader>
              <strong>Active Branches</strong>
            </CCardHeader>
            <CCardBody>
              {branches.length > 0 ? (
                <CTable align="middle" className="mb-0 border text-center" hover responsive>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>Branch Name</CTableHeaderCell>
                      <CTableHeaderCell>Branch Code</CTableHeaderCell>                      
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {branches.map((item, index) => (
                      <CTableRow
                        v-for="item in tableItems"
                        key={index}                        
                        style={{ cursor: 'grab' }}
                      >
                        <CTableDataCell>
                          <div>{item.branch_name}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.branch_code}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <p>No Active Branches</p>
              )}
            </CCardBody>
          </CCard>
    </div>
  )
}

export default SuperAdminDashboard