import type { ReactElement } from "react"


const ChatbotWrapper = ({
    children
}:{children:ReactElement}) => {
  return (
    <>
     {children} 
    </>
  )
}

export default ChatbotWrapper
