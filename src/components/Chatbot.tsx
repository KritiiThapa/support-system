
import { createChat } from "@n8n/chat";
import { useEffect } from "react";

const Chatbot = () => {
    useEffect(() => {
        createChat({
          webhookUrl:
            "https://kritithapa.app.n8n.cloud/webhook/dd3b2486-6cf2-4cfd-989c-27ce565bb0dc/chat",
          initialMessages: [
            "Hi there! 👋",
            "I am kriti's bot. How can I assist you today?",
            "You can ask me about Bijesh's projects, skills, or experience.",
          ],
        });
        return () => {
            const el = document.querySelector("#n8n-chat");
            if (el) el.remove();
        
            //if (chat?.destroy) chat.destroy();
          };
        
      }, []);
  return (
    <>
      
    </>
  )
}

export default Chatbot
