import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Message from '../message/Message';
import Post from '../post/Post';
import './home.css';

function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [allUsersPosts, setAllUsersPosts] = useState(null);
  const [searchRes,SetSearchRes] = useState(null);
  const  searchusersdev = useRef();
  const searchTerm = useRef();
  const navigate = useNavigate();
  const menuTrigger = useRef();
  const centerside = useRef();
  const searchusertxt = useRef();
  const rightside = useRef();
  // Handle messages with timeout
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  // Get all users and their posts
  useEffect(() => {
    axios.get('https://film-tech-backend.vercel.app/users/all')
      .then((res) => {
        setAllUsersPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Failed to load posts");
      });
  }, []);

  const reloadPosts = () => {
    axios.get('https://film-tech-backend.vercel.app/users/all')
      .then((res) => {
        setAllUsersPosts(res.data);
      })
      .catch((err) => {
        setMessage("Failed to reload posts");
      });
  };

  // Get logged-in user data
  const getUserData = () => {
    axios.get(`https://film-tech-backend.vercel.app/users/getuser/${window.localStorage.getItem('id')}`)
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        setMessage("There is a problem while getting your data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getUserData();
  }, [window.localStorage.getItem('id')]);


  const search = ()=> {
  const lowerCasedTerm = searchTerm.current.value.toLowerCase();

  let res =  allUsersPosts.filter(user =>
    user.name.toLowerCase().includes(lowerCasedTerm)
  );
  SetSearchRes(res);
  }
  return (
    <div className="home">
      <div className="div-for-btn">
        <button className="add-post-btn">
          <h1><Link className='txt' to="/addpost">Add Post</Link></h1>
        </button>
      </div>

      <header>
        <div className="left-side">
          <img className='logo' src="./FILM TECH lOGO.png" alt="logo" />
          <h1>Film Tech</h1>
        </div>

        <div className="center-side disappear" ref={centerside}>
          <ul>
            <li><Link className='txt' to={`/account/${window.localStorage.getItem("id")}`}>Account</Link></li>
            <li><Link className='txt' to={'/requests'}>Requests</Link></li>
            <li onClick={()=>{searchusersdev.current.classList.toggle("show"); searchusertxt.current.classList.toggle("red") }}  ref={searchusertxt}>Search Users</li>
          </ul>
          <div className='search-users' ref={searchusersdev}>
            <input type="text" ref={searchTerm}placeholder='Search People' onChange={search}/>
            <div className="search-result">
              {
                searchRes ?
                searchRes.map((user) => (
  <div key={user._id} onClick={()=>navigate(`/account/${user._id}`)}>
    <img onClick={()=>navigate(`/account/${user._id}`)} src={user.avatar} alt="avatar" />
    <h2 onClick={()=>navigate(`/account/${user._id}`)}>{user.name}</h2>
  </div>
)): null
              }
              </div>
          </div>
        </div>

        {!loading && user ? (
          <div className="right-side disappear" ref={rightside}>
            <img className="avatar" src={user.avatar} alt="User Avatar" />
            <h2>{user?.name}</h2>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
            <button class="menu-trigger" onClick={()=>{menuTrigger.current.classList.toggle("active");
              rightside.current.classList.toggle("disappear");
              centerside.current.classList.toggle("disappear")
            }} ref={menuTrigger} id="menu11">
      <span></span>
      <span></span>
      <span></span>
    </button>
      </header>

      <main>
        {message && <Message messageText={message} />}

        {allUsersPosts ? (
          [...allUsersPosts] // عكس المستخدمين لو تحب
            .reverse()
            .flatMap((e) =>
              [...e.posts] // عكس بوستات كل مستخدم
                .reverse()
                .map((post) => (
                  <Post
                    key={post.id}
                    id={post.id}
                    filmtitle={post.filmtitle}
                    filmrate={post.filmrate}
                    myopinion={post.myopinion}
                    category={post.category}
                    filmimage={post.filmimage}
                    comments={post.comments}
                    likes={post.likes}
                    name={e.name}
                    avatar={e.avatar}
                    userid={e._id}
                    reloadPost={reloadPosts}
                  />
                ))
            )
        ) : (
          <div className="loading-posts">
            <h1>Loading Posts</h1>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
