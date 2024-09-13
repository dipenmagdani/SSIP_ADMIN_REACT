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
  const [branchSelected, setBranchSelected] = useState(false)
  const [semesterSelected, setSemesterSelected] = useState(false)
  const [divisionSelected, setDivisionSelected] = useState(false)

  const [branches, setBranches] = useState([])
  const [semesters, setSemesters] = useState([])
  const [division, setDivision] = useState([])
  const [batches, setBatches] = useState([])

  const handleFormSubmit = (data) => {
    console.log(data)
  }

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
      setBranches(data)
      console.log(data.map((b) => b.slug))
    }
  }

  const handleSemester = async (branch_slug) => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/get_semesters_from_branch/${branch_slug}`,
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj?.response
      const data = response?.data?.data
      console.log(data)
      setSemesters(data)
    }
  }

  const handleDivision = async (semester_slug) => {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/get_divisons_from_semester/${semester_slug}`,
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj?.response
      const data = response?.data?.data
      console.log(data)
      setDivision(data)
    }
  }
  const handleBatches = async (division_slug) => {
    console.log(division_slug)
    // setSlug(division_slug)
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/get_batches_from_divison/${division_slug}`,
      'get',
      headers,
      null,
      null,
    )
    if (response_obj.error === false) {
      const response = response_obj?.response
      const data = response?.data?.data
      console.log(data)
      setBatches(data)
    }
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
                <Controller
                  control={control}
                  name="branch"
                  rules={{ required: 'Branch is required' }}
                  render={({ field }) => (
                    <CDropdown className="form-control shadow-sm focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
                      <CDropdownToggle
                        caret
                        className="w-full text-left bg-white border-none text-gray-700 rounded-md hover:text-yellow-500"
                      >
                        {field.value?.name || 'Select Branch'}
                      </CDropdownToggle>
                      {branches && branches.length > 0 && (
                        <CDropdownMenu className="w-full cursor-pointer">
                          {branches.map((b, index) => (
                            <CDropdownItem
                              onClick={() => {
                                setValue('branch', { name: b.branch_name, slug: b.slug })
                                setBranchSelected(true)
                                handleSemester(b.slug)
                              }}
                              key={index}
                            >
                              {b.branch_name}
                            </CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      )}
                    </CDropdown>
                  )}
                />
                {errors.branch && (
                  <p className="text-red-500 mt-1 text-sm">{errors.branch.message}</p>
                )}
              </div>

              {/* Select Semester */}
              {branchSelected && (
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
                          {field.value?.name || 'Select Semester'}
                        </CDropdownToggle>
                        {semesters && semesters.length > 0 && (
                          <CDropdownMenu className="w-full">
                            <CDropdownItem
                              onClick={() => {
                                setValue('semester', { name: 'Select All', slug: '__all__' })
                                setSemesterSelected(false)
                                // handleDivision('__all__')
                              }}
                            >
                              Select All
                            </CDropdownItem>
                            {semesters.map((s, index) => (
                              <CDropdownItem
                                onClick={() => {
                                  const slug = s.slug
                                  setValue('semester', { name: s.no, slug: s.slug })
                                  setSemesterSelected(true)
                                  if (slug !== '__all__') {
                                    handleDivision(slug)
                                  }
                                }}
                                key={index}
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
              {semesterSelected && (
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
                          {field.value?.name || 'Select Division'}
                        </CDropdownToggle>
                        <CDropdownMenu className="w-full">
                          {division &&
                            division.length > 0 &&
                            division.map((d, index) => (
                              <CDropdownItem
                                onClick={() => {
                                  setValue('division', { name: d.division_name, slug: d.slug })
                                  setDivisionSelected(true)
                                  handleBatches(d.slug)
                                }}
                                key={index}
                              >
                                {d.division_name}
                              </CDropdownItem>
                            ))}
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
              {divisionSelected && (
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
                          {field.value?.name || 'Select Batch'}
                        </CDropdownToggle>
                        <CDropdownMenu className="w-full">
                          {batches &&
                            batches.length > 0 &&
                            batches.map((b, index) => (
                              <CDropdownItem
                                onClick={() => {
                                  setValue('batch', { name: b.batch_name, slug: b.slug })
                                  setDivisionSelected(true)
                                }}
                                key={index}
                              >
                                {b.batch_name}
                              </CDropdownItem>
                            ))}
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
