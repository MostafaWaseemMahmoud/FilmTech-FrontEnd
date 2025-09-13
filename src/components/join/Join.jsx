import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import Message from '../message/Message';
import "./join.css";

function Join() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // For showing <Message />

  const nameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const avatarInput = useRef();

  const nameCharactersErr = useRef();
  const emailMatching = useRef();
  const passwordErr = useRef();
  const avatarMsg = useRef();

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const avatarChecking = () => {
    if (!avatarInput.current.files.length) {
      avatarMsg.current.textContent = "⚠️ Please upload your avatar.";
    } else {
      avatarMsg.current.textContent = "✅ Avatar uploaded successfully.";
    }
  };

  const submitForm = async () => {
    let valid = true;

    // Name validation
    if (nameInput.current.value.length < 3) {
      nameCharactersErr.current.textContent = "⚠️ Name must be at least 3 characters.";
      valid = false;
    } else {
      nameCharactersErr.current.textContent = "";
    }

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
    if (!avatarInput.current.files.length) {
      avatarMsg.current.textContent = "⚠️ Please upload your avatar.";
      valid = false;
    } else {
      avatarMsg.current.textContent = "✅ Avatar uploaded successfully.";
    }

    if (!valid) return;

    const opt = Math.floor(100000 + Math.random() * 900000);

    try {
      setLoading(true);

      // Send OTP to email
      await axios.post(`https://film-tech-backend.vercel.app/send/${emailInput.current.value}`, {
        subject: "Your OTP To Join Our Community (Film Tech)",
        message: `Your OTP Is ---> ${opt}`,
      });

      setLoading(false);

      const HisRes = window.prompt("Please enter the OTP we sent you:");

      if (Number(HisRes) !== opt) {
        setMessage("❌ You entered the wrong OTP.");
        return;
      }

      // If OTP is correct, submit user data
      const formData = new FormData();
      formData.append("name", nameInput.current.value);
      formData.append("email", emailInput.current.value);
      formData.append("password", passwordInput.current.value);
      formData.append("avatar", avatarInput.current.files[0]);

      setLoading(true);

      const response = await axios.post("https://film-tech-backend.vercel.app/users/add", formData);
      console.log(response.data.message);

      window.localStorage.setItem('id',response.data.user._id);

      setMessage("✅ Registration successful!");
      window.location.reload();
    } catch (error) {
      console.error("❌ Error:", error);

        setMessage("❌ Something went wrong. Please try again.");
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
      <div className="centered">
      <div className="signup-container">
        <div className="fields">
          <img src="./FILM TECH lOGO.png" className="logo" alt="Logo" />
          <h1 className="heading">Join Us</h1>

          <input ref={nameInput} type="text" placeholder="Please Enter Your Name" />
          <span ref={nameCharactersErr} className="err"></span>

          <input ref={emailInput} className="input" type="email" placeholder="Please Enter Your Email" />
          <span ref={emailMatching} className="err"></span>

          <input ref={passwordInput} className="input" type="password" placeholder="Please Enter Your Password" />
          <span ref={passwordErr} className="err"></span>

          <input
            ref={avatarInput}
            className="input"
            type="file"
            id="avatar-input"
            onChange={avatarChecking}
          />
          <label htmlFor="avatar-input">Upload Your Avatar Here 👇</label>
          <span ref={avatarMsg} className="err"></span>

          <button onClick={submitForm}>Join Us</button>

          <Link to='/findaccount' className='link1'>Already have An Account ?!</Link>
        </div>
      </div>
      </div>
    </>
  );
}

export default Join;
