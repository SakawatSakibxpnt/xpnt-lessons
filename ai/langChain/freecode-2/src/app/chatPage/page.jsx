"use client"

import Link from 'next/link'
import {useChat} from 'ai/react'
import {Message} from  'ai'
// import { Chat } from 'openai/resources'
import ChatMessage from '@/components/ChatMessage'
const ChatPage = () => {

  const {messages, append, isLoading, input, handleInputChange, handleSubmit} = useChat()
  return (
    <div className='p-5'>
      <Link className=" text-lg text-white py-2 px-4 rounded-md bg-black" href="/">Home</Link>
    
      <div className='m-20  min-h-[400px] bg-gray-100 p-10 rounded-lg relative'>
        {messages && messages.map((message,index)=>{
          return (
            <ChatMessage key={`message-${index}`} message={message}/>
          )
        })}
        <form onSubmit={handleSubmit} className='absolute bottom-5 '>
          <input className='w-[500px] p-2 mr-2' type="text" value={input} onChange={handleInputChange} placeholder='Enter your message'/>
          <input type="submit" value="Send" className='cursor-pointer bg-blue-500 text-white p-2 rounded-md'/>
        </form>
      </div>
    </div>
  )
}

export default ChatPage