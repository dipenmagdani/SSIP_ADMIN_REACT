import React, { useEffect, useState } from 'react'
import {
  COffcanvasBody,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'

export const ManageSurveys = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm()
  const [StoredTokens, CallAPI] = useAPI()

  const [numberOfOptions, setNumberOfOptions] = useState(1)
  const selectedBranch = watch('branch')
  const selectedSemester = watch('semester')
  const selectedDivision = watch('division')

  const [branch, setBranch] = useState([])
  const [semesters, setSemesters] = useState([])

  const handleFormSubmit = (data) => {}

  const handleBranch = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/get_branches_of_teacher`,
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj.response
      const data = response.data.data
      setBranch(data)
      console.log(data.map((b) => b.slug))
    }
  }

  const handleSemester = async (branch_slug) => {
    console.log(branch_slug)
    // const headers = {
    //   'Content-Type': 'application/json',
    //   'ngrok-skip-browser-warning': true,
    // }
    // const selectedBranchSlug = branch.find((b) => b.branch_name === selectedBranch)?.slug
    // const axiosInstance = axios.create()
    // const response_obj = await CallAPI(
    //   StoredTokens,
    //   axiosInstance,
    //   `/manage/get_semesters_from_branch/${selectedBranchSlug}`,
    //   'get',
    //   headers,
    //   null,
    //   null,
    // )
    // if (response_obj.error === false) {
    //   const response = response_obj?.response
    //   const data = response?.data?.data
    //   console.log(data)
    //   setSemesters(data)
    // }
  }

  useEffect(() => {
    handleBranch()
  }, [])

  const options = []
  for (let i = 0; i < numberOfOptions; i++) {
    options.push(
      <div className="mb-3 focus:border-yellow-500" key={i}>
        <label className="form-label ">Option {i + 1}</label>
        <input
          type="text"
          className="form-control focus:border-yellow-500"
          required
          {...register(`options[${i}]`)}
        />
      </div>,
    )
  }

  return (
    <div className="card w-full p-4 mx-auto" data-coreui-backdrop="static">
      <COffcanvasBody>
        <CCard className="shadow-lg rounded-lg border border-gray-200">
          <CCardHeader className="bg-[#c2bcf4] text-purple-700 text-2xl py-4 rounded-t-lg">
            Add Survey
          </CCardHeader>
          <CCardBody className="p-6">
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleFormSubmit)}
              autoComplete="off"
            >
              {/* Survey Title */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Title of Survey</label>
                <input
                  type="text"
                  className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                  required
                  {...register('survey_title')}
                />
              </div>

              {/* Number of Options */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Enter Number of Options</label>
                <input
                  type="number"
                  className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                  onChange={(e) => setNumberOfOptions(Number(e.target.value))}
                  required
                />
              </div>

              {/* Options Fields */}
              {options}

              {/* Select Branch */}
              <div className="mb-4">
                <label className="form-label text-lg font-semibold">Select Branch</label>
                <CDropdown className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
                  <CDropdownToggle
                    caret
                    className="w-full text-left bg-white text-gray-700 border rounded-md hover:text-yellow-500"
                  >
                    Select Branch
                  </CDropdownToggle>
                  {branch && branch.length > 0 && (
                    <CDropdownMenu className="w-full">
                      {branch.map((b, index) => (
                        <CDropdownItem
                          onClick={() => {
                            handleSemester(b.slug)
                            setValue('semester', '')
                          }}
                          key={b.id || index}
                        >
                          {b.branch_name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  )}
                </CDropdown>
                {/* {errors.branch && (
                  <p className="text-red-500 mt-1 text-sm">{errors.branch.message}</p>
                )} */}
              </div>

              {/* Select Semester */}
              {selectedBranch && (
                <div className="mb-4">
                  <label className="form-label text-lg font-semibold">Select Semester</label>
                  <Controller
                    control={control}
                    name="semester"
                    rules={{ required: 'Semester is required' }}
                    render={({ field }) => (
                      <CDropdown className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
                        <CDropdownToggle
                          caret
                          className="w-full text-left bg-white text-gray-700 border-none rounded-md hover:text-yellow-500"
                        >
                          {field.value || 'Select Semester'}
                        </CDropdownToggle>
                        {semesters && semesters.length > 0 && (
                          <CDropdownMenu className="w-full">
                            {semesters.map((s, index) => (
                              <CDropdownItem
                                onClick={() => {
                                  field.onChange(s.no)
                                  setValue('division', '')
                                }}
                                key={s.id || index}
                              >
                                {s.no}
                              </CDropdownItem>
                            ))}
                          </CDropdownMenu>
                        )}
                      </CDropdown>
                    )}
                  />
                  {errors.semester && (
                    <p className="text-red-500 mt-1 text-sm">{errors.semester.message}</p>
                  )}
                </div>
              )}

              {/* Select Division */}
              {selectedSemester && (
                <div className="mb-4">
                  <label className="form-label text-lg font-semibold">Select Division</label>
                  <Controller
                    control={control}
                    name="division"
                    rules={{ required: 'Division is required' }}
                    render={({ field }) => (
                      <CDropdown className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
                        <CDropdownToggle
                          caret
                          className="w-full text-left bg-white text-gray-700 border-none rounded-md hover:text-yellow-500"
                        >
                          {field.value || 'Select Division'}
                        </CDropdownToggle>
                        <CDropdownMenu className="w-full">
                          <CDropdownItem
                            onClick={() => {
                              field.onChange('A')
                              setValue('batch', '')
                            }}
                          >
                            A
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => {
                              field.onChange('B')
                              setValue('batch', '')
                            }}
                          >
                            B
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => {
                              field.onChange('C')
                              setValue('batch', '')
                            }}
                          >
                            C
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    )}
                  />
                  {errors.division && (
                    <p className="text-red-500 mt-1 text-sm">{errors.division.message}</p>
                  )}
                </div>
              )}

              {/* Select Batch */}
              {selectedDivision && (
                <div className="mb-4">
                  <label className="form-label text-lg font-semibold">Select Batch</label>
                  <Controller
                    control={control}
                    name="batch"
                    rules={{ required: 'Batch is required' }}
                    render={({ field }) => (
                      <CDropdown className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
                        <CDropdownToggle
                          caret
                          className="w-full text-left bg-white text-gray-700 border-none rounded-md hover:text-yellow-500"
                        >
                          {field.value || 'Select Batch'}
                        </CDropdownToggle>
                        <CDropdownMenu className="w-full">
                          <CDropdownItem onClick={() => field.onChange('A1')}>A1</CDropdownItem>
                          <CDropdownItem onClick={() => field.onChange('B1')}>B1</CDropdownItem>
                          <CDropdownItem onClick={() => field.onChange('C1')}>C1</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    )}
                  />
                  {errors.batch && (
                    <p className="text-red-500 mt-1 text-sm">{errors.batch.message}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-outline-dark bg-yellow-500 text-white hover:bg-yellow-600 focus:ring focus:ring-yellow-500 rounded-md px-4 py-2 form-control"
              >
                Submit
              </button>
            </form>
          </CCardBody>
        </CCard>
      </COffcanvasBody>
    </div>
  )
}

export default ManageSurveys
