import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import useAPI from 'src/global_function/useApi'
import CIcon from '@coreui/icons-react'
import { cilBook, cilCalendar, cilPencil } from '@coreui/icons'

const ChatBox = ({ visible, setVisible }) => {
  const [StoredTokens, CallAPI] = useAPI()

  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedMarks, setSelectedMarks] = useState(null)
  const [error, setError] = useState(null)
  const [showOptions, setShowOptions] = useState(true)
  const [currentQuery, setCurrentQuery] = useState(null)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Predefined messages
  const predefinedMessages = [
    { text: 'Attendance', response: 'You want to know about the attendance of which subject?' },
    { text: 'Marks', response: "Which subject's marks would you like to know about?" },
    {
      text: 'Materials',
      response: `You can check the latest material at View Materials page.`,
    },
    {
      text: 'Exam Results',
      response: 'Security in tech is about protecting systems, networks, and data from attacks.',
    },
    {
      text: 'Ongoing Events',
      response:
        'Interview preparation involves practicing coding problems, system design, and more.',
    },
  ]

  const fetchSubjects = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axios.create(),
        '/manage/get_subjects_of_student',
        'get',
        headers,
        null,
        null,
      )
      if (!response_obj.error) {
        const data = response_obj.response?.data?.data
        setSubjects(data)
        setError(null)
      } else {
        setError('Failed to fetch subjects. Please try again.')
      }
    } catch (e) {
      setError('An error occurred while fetching subjects. Please try again.')
    }
  }

  const fetchAttendance = async (slug) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axios.create(),
        `/manage/chatbot/get_student_attendance_detail_for_subject/${slug}`,
        'get',
        headers,
        null,
        null,
      )
      if (!response_obj.error) {
        const data = response_obj.response?.data?.data
        console.log(data)
        setSelectedSubject(data)
        setMessages((prev) => [...prev, { type: 'bot', content: 'Here is your attendance report' }])
        setError(null)
      } else {
        setError('No attendance details found for this subject. Please choose another subject.')
      }
    } catch (e) {
      setError('An error occurred while fetching attendance. Please try again.')
    }
  }

  const fetchMarks = async (slug) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axios.create(),
        `/manage/chatbot/get_result_of_student_by_subject/${slug}`,
        'get',
        headers,
        null,
        null,
      )
      if (!response_obj.error) {
        const data = response_obj.response?.data?.data
        setSelectedMarks(data)
        console.log(data)
        setMessages((prev) => [...prev, { type: 'bot', content: 'Here is your marks report' }])
        setError(null)
      } else {
        setError('No marks details found for this subject. Please choose another subject.')
      }
    } catch (e) {
      setError('An error occurred while fetching marks. Please try again.')
    }
  }

  const handleSubjectSelection = async (slug) => {
    setIsLoading(true)
    if (currentQuery === 'Attendance') {
      await fetchAttendance(slug)
    } else if (currentQuery === 'Marks') {
      await fetchMarks(slug)
    }
    setIsLoading(false)
    setShowOptions(true)
  }

  const handleMessageClick = (message) => {
    setIsLoading(true)
    setMessages((prev) => [...prev, { type: 'user', content: message.text }])

    setTimeout(() => {
      if (message.text === 'Attendance' || message.text === 'Marks') {
        setMessages((prev) => [...prev, { type: 'bot', content: message.response }])
        fetchSubjects()
        setShowOptions(false)
        setCurrentQuery(message.text)
        setSelectedSubject(null)
        setSelectedMarks(null)
      } else {
        setMessages((prev) => [...prev, { type: 'bot', content: message.response }])
        setShowOptions(true)
      }
      setIsLoading(false)
    }, 1000)
  }

  const getColorForPercentage = (percentage) => {
    if (percentage >= 75) return 'text-green-500'
    if (percentage >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (!visible) return null

  return (
    <div className="fixed right-4 md:right-10 bg-white p-4 md:p-6 rounded-2xl border border-gray-300 w-[90%] md:w-[440px] h-[90vh] md:h-[500px] bottom-4 md:bottom-20 shadow-lg transition-transform duration-300 ease-in-out opacity-100 translate-y-0 flex flex-col">
      <div className="flex flex-col space-y-2 pb-4">
        <h2 className="font-bold tracking-tight text-2xl text-gray-800">EduMate</h2>
        <p className="text-sm text-gray-500">Your virtual assistant</p>
      </div>

      <div className="h-[1px] bg-gray-200 mb-4"></div>

      {/* Scrollable Message Container */}
      <div className="flex-grow overflow-y-auto pr-4">
        {messages.length === 0 && (
          <div className="flex gap-3 my-4 text-gray-600 text-sm items-center">
            <span className="rounded-full bg-gray-100 p-1">
              <img src="./images/chatbot.png" alt="chat_icon" className="w-8" />
            </span>
            <p className="leading-relaxed">What do you want to know?</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 my-2 text-sm items-start ${
              message.type === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.type === 'bot' && (
              <span className="rounded-full rounded-tl-md bg-gray-100 p-1 ">
                <img src="./images/chatbot.png" alt="chat_icon" className="w-6" />
              </span>
            )}
            <div
              className={`${
                message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              } rounded-lg px-3 py-2 max-w-[70%]`}
            >
              <p className="leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Selected Subject Data for Attendance */}
        {selectedSubject && (
          <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedSubject.subject_name}
                </h3>
                <div
                  className={`text-2xl font-bold ${getColorForPercentage(
                    parseFloat(selectedSubject.attendance_percentage),
                  )}`}
                >
                  {selectedSubject.attendance_percentage}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-blue-100 rounded-full">
                    <CIcon icon={cilBook} size="xl" className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attended</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedSubject.attended_lec}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-purple-100 rounded-full">
                    <CIcon icon={cilCalendar} size="xl" className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedSubject.total_lectures}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-2 bg-gray-200">
              <div
                className={`h-full ${getColorForPercentage(
                  parseFloat(selectedSubject.attendance_percentage),
                )}`}
                style={{ width: `${selectedSubject.attendance_percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Selected Subject Data for Marks */}
        {selectedMarks &&
          selectedMarks.map((marks, index) => (
            <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden" key={index}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {marks?.subject?.subject_name}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-green-100 rounded-full">
                      <CIcon icon={cilPencil} size="xl" className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gained Marks</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {marks.gained_marks}/{marks.total_marks}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-indigo-100 rounded-full">
                      <CIcon icon={cilBook} size="xl" className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Subject Credit</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {marks?.subject?.credit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-200">
                <div
                  className={`h-full ${getColorForPercentage(selectedMarks.percentage)}`}
                  style={{ width: `${selectedMarks.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}

        {/* Error Message */}
        {error && (
          <div className="p-2 bg-red-100 border border-red-300 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Subject Options for Attendance and Marks */}
      {subjects.length > 0 && !selectedSubject && !selectedMarks && !showOptions && (
        <div className="flex flex-wrap gap-3 my-4 text-sm items-center justify-center">
          {subjects.map((sub) => (
            <div
              key={sub.slug}
              onClick={() => handleSubjectSelection(sub.slug)}
              className="border-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 px-4 py-2 cursor-pointer"
            >
              <span>{sub.subject_name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Predefined Message Options */}
      {!isLoading && showOptions && (
        <div className="flex flex-wrap gap-2 md:gap-3 mt-4 text-xs md:text-sm items-center justify-center">
          {predefinedMessages.map((message, index) => (
            <div
              key={index}
              onClick={() => handleMessageClick(message)}
              className="border-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 px-3 md:px-4 py-1 md:py-2 cursor-pointer"
            >
              <span>{message.text}</span>
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default ChatBox
