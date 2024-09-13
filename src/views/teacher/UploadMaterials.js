import React, { useEffect, useState } from 'react'
import { COffcanvasBody, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCloudUpload, cilAccountLogout } from '@coreui/icons'
import Swal from 'sweetalert'

import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'
import useDrivePicker from 'react-google-drive-picker'

const UploadMaterials = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [openPicker, authResponse] = useDrivePicker()
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [subjects, setSubjects] = useState([])
  const [StoredTokens, CallAPI] = useAPI()

  const CLIENT_ID = '844209905502-hg3oiak3hj9e0n9apgfap2q24lrd41vj.apps.googleusercontent.com'
  const API_KEY = 'AIzaSyDHKDicnezuQryxOPs8WhIWkZaHDRAvedQ'

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm()

  const handleFormSubmit = (data) => {
    const fileUrl = uploadedFiles.map((file) => file.url)
    const formData = {
      material_title: data.material_title,
      subject_slug: data.subject,
      material_link: fileUrl,
    }
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const axiosInstance = axios.create()
    CallAPI(
      StoredTokens,
      axiosInstance,
      `/manage/additional_features/upload_study_material/`,
      'post',
      headers,
      {
        material_title: formData.material_title,
        material_link: formData.material_link,
        subject_slug: formData.subject_slug,
      },
      null,
    ).then((resObject) => {
      if (resObject.error === false) {
        // const response = resObject.response
        // const data = response?.data?.data
        // console.log(data)
        Swal('Material uploaded successfully', 'success')
      } else {
        Swal('Oops!', resObject.errorMessage.message, 'error')
      }
    })
    console.log(formData)
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
        `/manage/get_subjects_of_teacher`,
        'get',
        headers,
        null,
        null,
      )
      if (response_obj.error === false) {
        const response = response_obj.response
        const data = response.data.data
        setSubjects(data)
        console.log(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    handleSubject()
  }, [])

  useEffect(() => {
    if (authResponse) {
      const token = authResponse.access_token
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
    if (!isAuthenticated) {
      openPicker({
        clientId: CLIENT_ID,
        developerKey: API_KEY,
        viewId: 'DOCS',
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: true,
        customScopes: ['https://www.googleapis.com/auth/drive'],
        callbackFunction: (data) => {
          if (data.action === 'loaded') {
            console.log('Google Drive Picker loaded')
          }
        },
      })
    } else {
      // If already authenticated, open the picker for file upload
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
            console.log(data)
            data.docs.forEach((file) => {
              shareFile(file.id)
            })
          }
        },
      })
    }
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
        console.log(`File ID ${fileId} is now sharable.`)
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
    console.log(authToken)
  }, [authToken])

  return (
    <div className="card w-full p-4 mx-auto" data-coreui-backdrop="static">
      <COffcanvasBody>
        {authToken && (
          <div className="mb-3 flex items-end justify-end">
            <button
              type="button"
              className="btn btn-outline-dark bg-black text-white hover:bg-yellow-600 focus:ring focus:ring-yellow-500 rounded-md px-4 py-2"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-2">
                <CIcon icon={cilAccountLogout} size="lg" />
                Logout
              </div>
            </button>
          </div>
        )}
        <CCard className="shadow-lg rounded-lg border border-gray-200">
          <CCardHeader className="bg-[#c2bcf4] text-purple-700 text-2xl py-4 rounded-t-lg">
            Upload Materials
          </CCardHeader>
          <CCardBody className="p-6">
            {isAuthenticated ? (
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleFormSubmit)}
                autoComplete="off"
              >
                {/* Survey Title */}
                <div className="mb-4">
                  <label className="form-label text-lg font-semibold">Filename</label>
                  <input
                    type="text"
                    className="form-control border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                    required
                    {...register('material_title')}
                  />
                </div>

                {/* Select Subject */}
                <div className="mb-4">
                  <label className="form-label text-lg font-semibold">Select Subject</label>
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
                    <p className="text-red-500 mt-1 text-sm">{errors.subject.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <button
                    type="button"
                    className="btn btn-outline-dark bg-blue-500 text-white hover:bg-black focus:ring focus:ring-black-500 rounded-md px-4 py-2"
                    onClick={handlePickerOpen}
                  >
                    <div className="flex items-center gap-2">
                      <CIcon icon={cilCloudUpload} size="xl" />
                      <span>Upload Files</span>
                    </div>
                  </button>
                </div>

                <div className="w-full">
                  {uploadedFiles.length > 0 && (
                    <label className="form-label text-lg font-semibold">Selected Files</label>
                  )}
                  {isAuthenticated && uploadedFiles.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedFiles.map((file) => (
                        <li
                          key={file.id}
                          className="bg-gray-50 p-2 border-2 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out flex flex-col items-center justify-center"
                        >
                          <span className="text-blue-600 hover:text-blue-800 cursor-pointer text-center text-sm">
                            {file.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`btn btn-outline-dark bg-yellow-500 text-white rounded-md px-4 py-2 form-control ${
                    uploadedFiles.length === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-yellow-600 focus:ring focus:ring-yellow-500'
                  }`}
                  disabled={uploadedFiles.length === 0} // Disable if required fields are empty
                >
                  Submit
                </button>
              </form>
            ) : (
              <button
                type="button"
                className={`btn btn-outline-dark bg-yellow-500 text-white hover:bg-yellow-600 focus:ring focus:ring-yellow-500 rounded-md px-4 py-2 form-control `}
                onClick={handlePickerOpen}
              >
                <div className="flex items-center gap-2 justify-center">
                  {/* <CIcon icon={cilCloudUpload} size="xl" /> */}
                  <span>Login With Google</span>
                </div>
              </button>
            )}
          </CCardBody>
        </CCard>
      </COffcanvasBody>
    </div>
  )
}

export default UploadMaterials
