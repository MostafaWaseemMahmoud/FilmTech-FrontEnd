import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from "../post/Post";
import './account.css';

const Account = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relationship, setRelationship] = useState("Add Friend");
  const friendredbtn = useRef();
  const [alreadyFriend,setAlFriend] = useState(false);
  const navigate = useNavigate();

const getUserData = async () => {
  try {
    const res = await axios.get(`https://film-tech-backend.vercel.app/users/getuser/${id}`);
    const profileUser = res.data.user;
    setUser(profileUser);
    console.log(profileUser)

    const res1 = await axios.get(
      `https://film-tech-backend.vercel.app/users/getuser/${window.localStorage.getItem('id')}`
    );
    const loggedUser = res1.data.user;
     if (loggedUser.friendRequests.includes(id)) {
      // I already sent them a request
      setAlFriend(true);
      setRelationship("Friend Req Sent")
    }

    if(loggedUser.waitingFriends.includes(id)){
      setRelationship("He Sent you a Friend req")
      setAlFriend(true);
    }
    if(loggedUser.friends.includes(id)){
      setRelationship("Your Friend")
      setAlFriend(true);
    }


    // --- Fetch friends' data ---
    const friendsData = await Promise.all(
      profileUser.friends.map(friendId =>
        axios.get(`https://film-tech-backend.vercel.app/users/getuser/${friendId}`).then(r => r.data.user)
      )
    );
    setFriends(friendsData);

  } catch (err) {
    console.error(err);
    setMessage("Error loading user data.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    getUserData();
  }, [id]);

  if (loading) return <div className='account'><div className="account-loading">Loading...</div></div>
  if (message) return <div className='account'><div className="account-error">{message}</div></div>


  const reloadPosts = () => {
    axios.get('https://film-tech-backend.vercel.app/users/all')
      .then((res) => {
        setAllUsersPosts(res.data);
      })
      .catch((err) => {
        setMessage("Failed to reload posts");
      });
    };

  return (
    <div className="account">
    <button className='backBTN' onClick={()=>{navigate("/")}}>Go Back</button>
    <div className="account-container">
      <div className="account-header">
        <div>
        <div className='flex'>
        <img className="account-avatar" src={user.avatar} alt="avatar" />
        <div className='margin-l-20'>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <small>Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
        </div>
        </div>
        </div>
<div>
  {
    id === window.localStorage.getItem("id") ? (
      <button className='accbtn' onClick={()=>{window.localStorage.removeItem("id"); navigate("/"); window.location.reload();}}>LogOut</button>
    ) : (
      friends.some(friend => friend._id === window.localStorage.getItem("id")) ? (
        <h1>Your Friend</h1>
      ) : (
        <button
          className='accbtn'
          ref={friendredbtn}
          onClick={async () => {
            try {
              if(!alreadyFriend){
                await axios.post(`https://film-tech-backend.vercel.app/users/friendreq/${window.localStorage.getItem("id")}/${id}`,);
                getUserData();
                friendredbtn.current.textContent = "Friend Request Sent";
              }else {
                return;
              }
            } catch (error) {
              console.error("Failed to add friend", error);
              setMessage("Failed to add friend.");
            }
          }}
        >
          {relationship}
        </button>
      )
    )
  }
</div>
      </div>

      <div className="account-section">
        <h3>Friends</h3>
        <div className="account-friends">
          {friends.map(friend => (
            <img
            onClick={()=>{navigate(`/account/${friend._id}`); window.location.reload()}}
              key={friend._id}
              src={friend.avatar}
              alt={friend.name}
              title={friend.name}
              className="friend-avatar"
            />
          ))}
        </div>
      </div>

      <div className="account-section">
        <h3>Posts</h3>
        <div className="account-posts">
          {[...(user.posts || [])].reverse().map((post, index) => (
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
                    name={user.name}
                    avatar={user.avatar}
                    userid={user._id}
                    reloadPost={reloadPosts}
                  />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Account;
