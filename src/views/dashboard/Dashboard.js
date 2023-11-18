import React from 'react'
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardFooter,
  CCol,
  CRow,
} from '@coreui/react'
// import { CChartLine } from '@coreui/react-chartjs'
// import { getStyle, hexToRgba } from '@coreui/utils'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import FormControl from '../forms/form-control/FormControl'
import Select from '../forms/input-group/InputGroup'
import Validation from '../forms/validation/Validation'

const Dashboard = () => {
  const [steps, setsteps] = useState({ Steps: 1 })
  const prevSteps = () => {
    const { Steps } = steps
    setsteps({ Steps: Steps - 1 })
  }
  const nextSteps = () => {
    const { Steps } = steps
    setsteps({ Steps: Steps + 1 })
  }
  const progressExample = [
    { title: 'Batches', value: '29.703 Batches' },
    { title: 'Semester', value: '24.093 Semester' },
    { title: 'Subjects', value: '78.706 Subjects' },
  ]

  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <CButton style={{ backgroundColor: 'transparent', border: 'none' }}>
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
        const { Steps } = steps
        switch (Steps) {
          case 1:
            return <Validation nextForm={nextSteps} prevForm="prevSteps"></Validation>
          case 2:
            return <FormControl nextForm={nextSteps} prevForm={prevSteps}></FormControl>
          case 3:
            return <Select nextForm={nextSteps} prevForm={prevSteps}></Select>
          default:
            console.log(steps)
        }
      })()}
    </>
  )
}

export default Dashboard
