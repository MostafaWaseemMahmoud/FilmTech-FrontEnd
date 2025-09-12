
import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Message from '../message/Message';

const Find = () => {
  const Navigate = useNavigate()
    const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // For showing <Message />

  const emailInput = useRef();
  const passwordInput = useRef();

  const emailMatching = useRef();
  const passwordErr = useRef();

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const submitForm = async () => {
    let valid = true;
    // Email validation
    const emailReg = /^\w+(\d+)?@gmail\.com$/;
    if (emailInput.current.value === "") {
      emailMatching.current.textContent = "⚠️ Please enter an email.";
      valid = false;
    } else if (!emailInput.current.value.match(emailReg)) {
      emailMatching.current.textContent = "⚠️ Invalid email format.";
      valid = false;
    } else {
      emailMatching.current.textContent = "";
    }

    // Password validation
    if (passwordInput.current.value.length < 6) {
      passwordErr.current.textContent = "⚠️ Password must be at least 6 characters.";
      valid = false;
    } else {
      passwordErr.current.textContent = "";
    }

    // Avatar validation

    if (!valid) return;

    try {
        const body =  {
          email:emailInput.current.value,
          password:passwordInput.current.value
        }
      setLoading(true);

      const response = await axios.post("https://film-tech-backend.vercel.app/users/finduser", body);
      console.log(response.data);

      window.localStorage.setItem('id',response.data._id);

      setMessage("✅ We Had Find Your Account successful!");
      Navigate('/')
      window.location.reload();
    } catch (error) {
      console.error("❌ Error:", error);

        setMessage(`❌ Error While Finding YOur Account Recorrect Your data`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loadingIndicator">
          <h1>Loading...</h1>
        </div>
      )}

      {message && <Message messageText={message} />} {/* Show result message */}

      <div className="signup-container">
        <div className="fields">
          <img src="./FILM TECH lOGO.png" className="logo" alt="Logo" />
          <h1 className="heading">Find Your Account</h1>


          <input ref={emailInput} className="input" type="email" placeholder="Please Enter Your Email" />
          <span ref={emailMatching} className="err"></span>

          <input ref={passwordInput} className="input" type="password" placeholder="Please Enter Your Password" />
          <span ref={passwordErr} className="err"></span>

          <button onClick={submitForm}>Find Your Account</button>

          <Link to='/' className='link1'>Are You New Here ?!</Link>
        </div>
      </div>
    </>
  );
};

export default Find;