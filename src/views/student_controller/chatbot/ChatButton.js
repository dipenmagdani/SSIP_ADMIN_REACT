import React from 'react'
import { MessageCircle } from 'lucide-react'

function ChatButton({ setVisible }) {
  return (
    <button
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50"
      onClick={() => setVisible((prev) => !prev)}
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
      <span className="sr-only">Open chat</span>
    </button>
  )
}

export default ChatButton
