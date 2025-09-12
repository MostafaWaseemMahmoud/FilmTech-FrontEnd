import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../message/Message";
import './add.css';

const AddPost = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const nameInput = useRef();
  const filmRate = useRef();
  const opinionInput = useRef();
  const PosterInput = useRef();
  const category = useRef();

  const nameCharactersErr = useRef();
  const RateNumErr = useRef();
  const OpinionErr = useRef();
  const PosterMsg = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    // Example: Replace with your actual user fetch logic
    const fetchUser = async () => {
      try {
        const userId = window.localStorage.getItem('id');
        const res = await axios.get(`https://film-tech-backend.vercel.app/users/getuser/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const PosterChecking = () => {
    if (!PosterInput.current.files.length) {
      PosterMsg.current.textContent = "⚠️ Please upload your Show Poster.";
    } else {
      PosterMsg.current.textContent = "✅ Poster uploaded successfully.";
    }
  };

  const submitForm = async () => {
    let valid = true;

    // Name validation
    if (nameInput.current.value.trim().length < 3) {
      nameCharactersErr.current.textContent = "⚠️ Name must be at least 3 characters.";
      valid = false;
    } else {
      nameCharactersErr.current.textContent = "";
    }

    // Rate validation
    const rateValue = parseFloat(filmRate.current.value);
    if (!filmRate.current.value) {
      RateNumErr.current.textContent = "⚠️ Please enter a film rate.";
      valid = false;
    } else if (rateValue > 10 || rateValue < 0) {
      RateNumErr.current.textContent = "⚠️ The rate must be between 0 and 10.";
      valid = false;
    } else {
      RateNumErr.current.textContent = "";
    }

    // Opinion validation
    if (opinionInput.current.value.trim().length < 6) {
      OpinionErr.current.textContent = "⚠️ Opinion must be at least 6 characters.";
      valid = false;
    } else {
      OpinionErr.current.textContent = "";
    }

    // Poster validation
    if (!PosterInput.current.files.length) {
      PosterMsg.current.textContent = "⚠️ Please upload your Poster.";
      valid = false;
    } else {
      PosterMsg.current.textContent = "✅ Poster uploaded successfully.";
    }

    if (!valid) return;

    try {
      const formData = new FormData();
      formData.append("filmtitle", nameInput.current.value);
      formData.append("filmrate", filmRate.current.value);
      formData.append("myopinion", opinionInput.current.value);
      formData.append("category", category.current.value);
      formData.append("filmimage", PosterInput.current.files[0]);

      setLoading(true);

      const response = await axios.post(
        `https://film-tech-backend.vercel.app/posts/addpost/${window.localStorage.getItem('id')}`,
        formData
      );

      console.log(response.data.message);
      setMessage("✅ Post added successfully!");
      navigate('/');
      window.location.reload();

    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addpost">
      <header>
        <div className="left-side">
          <img className="logo" src="./FILM TECH lOGO.png" alt="logo" />
          <h1>Film Tech</h1>
        </div>

        <div className="center-side">
          <ul>
            <li>Account</li>
            <li>Friends</li>
            <li>Search Users</li>
          </ul>
        </div>

        {!loading && user ? (
          <div className="right-side">
            <img className="avatar" src={user.user.avatar} alt="User Avatar" />
            <h2>{user.user.name}</h2>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </header>

      <main>
        {loading && <div className="loadingIndicator"><h1>Loading...</h1></div>}

        {message && <Message messageText={message} />}

        <div className="signup-container">
          <div className="fields">
            <img src="./FILM TECH lOGO.png" className="logo" alt="Logo" />
            <h1 className="heading">What Do You Want to Share</h1>

            <input ref={nameInput} type="text" placeholder="Please Enter Your Show Name" />
            <span ref={nameCharactersErr} className="err"></span>

            <input ref={filmRate} className="input" type="number" placeholder="Rate the Show (0-10)" />
            <span ref={RateNumErr} className="err"></span>

            <input ref={opinionInput} className="input" type="text" placeholder="What Do You Think About That Show?" />
            <span ref={OpinionErr} className="err"></span>

            <select ref={category}>
              <option value="">Choose Show Category</option>
              <option value="Film">Film</option>
              <option value="Series">Series</option>
            </select>

            <input
              ref={PosterInput}
              className="input"
              type="file"
              id="avatar-input"
              onChange={PosterChecking}
            />

            <label htmlFor="avatar-input">Upload Your Show Poster Here 👇</label>
            <span ref={PosterMsg} className="err"></span>

            <button onClick={submitForm}>Add Post</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddPost;
