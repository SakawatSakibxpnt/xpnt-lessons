import React from 'react'

const ChatMessage = ({message}) => {
    const {role,content} = message
  return (
    <div>{content}</div>
  )
}

export default ChatMessage