import React from 'react'

function ProgressBar({progress}) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700 absolute left-0 bottom-0 mb-[-3px] ${progress <=0 && 'opacity-0'}`}>
    <div
      className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500 transition-all duration-500 ease-out"
      style={{
        width: `${progress}%`,
      }}
    ></div>
  </div>
  )
}

export default ProgressBar