import React, { useEffect, useState } from 'react'
import {
  COffcanvasBody,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import {
  cilCloudUpload,
  cilAccountLogout,
  cilArrowCircleBottom,
  cilArrowCircleTop,
} from '@coreui/icons'
import Swal from 'sweetalert'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'
import useDrivePicker from 'react-google-drive-picker'
const UploadMaterials = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [openPicker, authResponse] = useDrivePicker()
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [subjects, setSubjects] = useState([])
  const [fileHistory, setFileHistory] = useState([])
  const [StoredTokens, CallAPI] = useAPI()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenLinks, setIsOpenLinks] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [expired, setExpired] = useState()

  const CLIENT_ID = '844209905502-hg3oiak3hj9e0n9apgfap2q24lrd41vj.apps.googleusercontent.com'
  const API_KEY = 'AIzaSyDHKDicnezuQryxOPs8WhIWkZaHDRAvedQ'

  const {
    handleSubmit,

    register,
    reset,
    formState: { errors },
  } = useForm()

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }
  const toggleDropdownLinks = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleFormSubmit = (data) => {
    const materials = uploadedFiles.map((file) => ({
      file_name: file.name,
      link: file.url,
    }))
    const formData = {
      material_title: data.material_title,
      subject_slug: data.subject,
      materials: materials,
    }
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    CallAPI(
      StoredTokens,
      axiosInstance,
      '/manage/additional_features/upload_study_material/',
      'post',
      headers,
      {
        material_title: formData.material_title,
        materials: formData.materials,
        subject_slug: formData.subject_slug,
      },
      null,
    ).then((resObject) => {
      if (resObject.error === false) {
        // const response = resObject.response
        // const data = response?.data?.data
        // console.log(data)
        handleFileHistory()
        Swal('Material Uploaded!', '', 'success')
      } else {
        Swal('Oops!', resObject.errorMessage.message, 'error')
      }
    })

    reset()
    setUploadedFiles([])
  }

  const handleSubject = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        '/manage/get_subjects_of_teacher',
        'get',
        headers,
        null,
        null,
      )
      if (response_obj.error === false) {
        const response = response_obj.response
        const data = response?.data?.data
        setSubjects(data)
        // console.log(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleFileHistory = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const axiosInstance = axios.create()
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        `/manage/additional_features/get_study_material_for_teachers`,
        'get',
        headers,
        null,
        null,
      )
      if (response_obj.error === false) {
        const response = response_obj.response
        const data = response?.data?.data
        console.log(data)
        setFileHistory(data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    handleFileHistory()
  }, [uploadedFiles])
  useEffect(() => {
    handleSubject()
  }, [])

  useEffect(() => {
    if (authResponse) {
      const token = authResponse.access_token
      setExpired(authResponse.expires_in)
      localStorage.setItem('authToken', token)
      setAuthToken(token)
      setIsAuthenticated(true)

      window.location.reload()
    }
  }, [authResponse])

  useEffect(() => {
    setIsAuthenticated(!!authToken)
  }, [authToken])

  const handlePickerOpen = () => {
    openPicker({
      clientId: CLIENT_ID,
      developerKey: API_KEY,
      viewId: 'DOCS',
      token: authToken,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      customScopes: ['https://www.googleapis.com/auth/drive'],
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        } else if (data.docs && data.docs.length > 0) {
          setUploadedFiles((files) => [...files, ...data.docs])
          // console.log(data)
          data.docs.forEach((file) => {
            shareFile(file.id)
          })
        }
      },
    })
  }

  const shareFile = async (fileId) => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?key=${API_KEY}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      })

      if (response.ok) {
        console.log('File ID ${fileId} is now sharable.', fileId)
      } else {
        const result = await response.json()
        console.error('Error making file sharable:', result.error)
      }
    } catch (error) {
      console.error('An error occurred while sharing the file:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setAuthToken('')
    setIsAuthenticated(false)
  }

  useEffect(() => {
    console.log(fileHistory)
  }, [])

  return (
    <div className="card w-full p-2 sm:p-4 mx-auto" data-coreui-backdrop="static">
      <COffcanvasBody>
        {authToken && (
          <div className="mb-3 flex justify-end ">
            <button
              type="button"
              className="btn bg-sky-600 text-white hover:bg-gray-400 focus:ring focus:ring-yellow-500 rounded-md px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base"
              onClick={handleLogout}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-2">
                <CIcon icon={cilAccountLogout} size="sm" />
                <span className="hidden sm:inline">Logout</span>
              </div>
            </button>
          </div>
        )}
        <CCard className="shadow-lg rounded-lg border border-gray-200">
          <CCardHeader className="bg-[#c2bcf4] text-purple-900 text-lg sm:text-2xl py-2 sm:py-4 rounded-t-lg">
            Upload Materials
          </CCardHeader>
          <CCardBody className="p-3 sm:p-6">
            {isAuthenticated ? (
              <form
                className="space-y-2 sm:space-y-4"
                onSubmit={handleSubmit(handleFormSubmit)}
                autoComplete="off"
              >
                <div className="mb-2 sm:mb-4">
                  <label className="form-label text-base sm:text-lg font-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 w-full"
                    required
                    {...register('material_title')}
                  />
                </div>
                <div className="mb-2 sm:mb-4">
                  <label className="form-label text-base sm:text-lg font-semibold">
                    Select Subject
                  </label>
                  <select
                    {...register('subject', { required: 'Branch is required' })}
                    className="form-control shadow-sm focus:ring focus:ring-yellow-500 focus:ring-opacity-50 w-full border-gray-300 rounded-md"
                  >
                    <option value="" selected disabled hidden className="text-gray-200">
                      Choose Subject
                    </option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject.slug}>
                        {subject.subject_name}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 mt-1 text-xs sm:text-sm">{errors.subject.message}</p>
                  )}
                </div>
                <div className="mb-2 sm:mb-4">
                  <button
                    type="button"
                    className="btn btn-outline-dark bg-blue-500 text-white hover:bg-black flex justify-center items-center gap-1 sm:gap-2 w-full sm:w-auto px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base"
                    onClick={handlePickerOpen}
                  >
                    <CIcon icon={cilCloudUpload} size="sm" />
                    <span>Select Files</span>
                  </button>
                </div>
                {uploadedFiles.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {uploadedFiles.map((file) => (
                      <li
                        key={file.id}
                        className="bg-gray-50 p-1 sm:p-2 border rounded-md text-xs sm:text-sm"
                      >
                        <span className="text-blue-600">{file.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="submit"
                  className="btn btn-outline-dark bg-bg-transparent text-black rounded-md px-2 sm:px-4 py-2 sm:py-2 form-control hover:bg-neutral-200 focus:ring focus:ring-yellow-500 w-full text-xs sm:text-base"
                  disabled={uploadedFiles.length === 0}
                >
                  Upload Files
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="btn text-white bg-gray-200/30 hover:bg-gray-500/30 focus:bg-gray-500/50 hover:border-2 hover:border-red-500 rounded-lg px-2 sm:px-4 py-1 sm:py-2 border form-control w-full text-xs sm:text-base"
                onClick={handlePickerOpen}
              >
                <div className="flex items-center gap-1 sm:gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#fbc02d"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#e53935"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4caf50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1565c0"
                      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <div className="text-sm sm:text-lg text-black font-bold">Login with Google</div>
                </div>
              </button>
            )}
          </CCardBody>
        </CCard>
      </COffcanvasBody>

      <COffcanvasBody className="mt-2 sm:mt-4 flex justify-center">
        <CRow className="mt-1 sm:mt-2 w-full">
          <CCol xs>
            <CCard className="mb-2 sm:mb-4">
              <CCardHeader onClick={toggleDropdown} className="cursor-pointer">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <strong className="text-sm sm:text-base">File History</strong>
                  </div>
                  <CIcon
                    icon={isOpen ? cilArrowCircleTop : cilArrowCircleBottom}
                    size="lg"
                    className="hover:scale-125 ease-in-out transition-all duration-150 cursor-pointer"
                  />
                </div>
              </CCardHeader>
              {isOpen && (
                <CCardBody className="transition ease-in-out duration-150 p-1 sm:p-3">
                  <div className="overflow-x-auto">
                    <CTable
                      align="middle"
                      className="mb-0 border text-center text-xs sm:text-sm"
                      hover
                      responsive
                    >
                      <CTableHead color="light">
                        <CTableRow>
                          <CTableHeaderCell>Sr.No</CTableHeaderCell>
                          <CTableHeaderCell>File Name</CTableHeaderCell>
                          <CTableHeaderCell>Subject</CTableHeaderCell>
                          <CTableHeaderCell>Link</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {fileHistory &&
                          fileHistory.length > 0 &&
                          fileHistory.map((item, index) => (
                            <CTableRow v-for="item in tableItems" key={index}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{item.title}</CTableDataCell>
                              <CTableDataCell>{item?.subject?.subject_name}</CTableDataCell>
                              <CTableDataCell>
                                <CCardHeader
                                  onClick={() => toggleDropdownLinks(index)}
                                  className="cursor-pointer rounded-lg border p-1 sm:p-2"
                                >
                                  <div className="flex flex-wrap justify-between items-center">
                                    <div>
                                      <strong className="text-xs sm:text-sm">Links</strong>
                                    </div>
                                    <CIcon
                                      icon={
                                        openDropdowns[index]
                                          ? cilArrowCircleTop
                                          : cilArrowCircleBottom
                                      }
                                      size="lg"
                                      className="hover:scale-125 ease-in-out transition-all duration-150 cursor-pointer"
                                    />
                                  </div>
                                </CCardHeader>
                                {openDropdowns[index] && (
                                  <div className="overflow-x-auto whitespace-nowrap">
                                    <CTable
                                      align="middle"
                                      className="mb-0 border text-center text-xs"
                                      hover
                                      responsive
                                    >
                                      <CTableBody>
                                        {item?.links?.map((link, linkIndex) => (
                                          <CTableRow key={linkIndex}>
                                            <CTableDataCell>
                                              <a
                                                href={link.link}
                                                target="_blank"
                                                className="text-primary"
                                                rel="noopener noreferrer"
                                              >
                                                {link.filename.length > 10
                                                  ? link.filename.slice(0, 10) + '...'
                                                  : link.filename}
                                              </a>
                                            </CTableDataCell>
                                          </CTableRow>
                                        ))}
                                      </CTableBody>
                                    </CTable>
                                  </div>
                                )}
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                      </CTableBody>
                    </CTable>
                  </div>
                </CCardBody>
              )}
            </CCard>
          </CCol>
        </CRow>
      </COffcanvasBody>
    </div>
  )
}

export default UploadMaterials
