import { useEffect, useRef } from 'react';
import './message.css';
const Message = ({messageText}) => {
  const message = useRef();
  useEffect(()=>{
    message.current.style.left = '20px'
  },[message])
  return (
    <div ref={message} className='message'>
      <h1>{messageText}</h1>
    </div>
  );
};

export default Message;