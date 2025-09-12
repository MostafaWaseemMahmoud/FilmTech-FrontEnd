import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../message/Message';
import './req.css';

const Req = () => {
  const [user, setUser] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const acceptReq = async (id) => {
      await axios.post(
        `https://film-tech-backend.vercel.app/users/acceptreq/${window.localStorage.getItem("id")}/${id}`
      ).then((res)=> {
        setMessage('Friend Request Accepted')
              setUserFriends((prev) => prev.filter((f) => f._id !== id));
      }).catch((err)=>{
        setMessage(err.response.data.message);
        console.log('res',err);
        console.log('user',user);
  })
    }
  const rejectReq = (id) => {
    console.log("Req has Been Rejected");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get logged-in user
        const res = await axios.get(
          `https://film-tech-backend.vercel.app/users/getuser/${window.localStorage.getItem('id')}`
        );
        setUser(res.data.user);

        // Fetch waiting friends in parallel
        const requests = await Promise.all(
          res.data.user.waitingFriends.map((idOfWaitingFriend) =>
            axios.get(`https://film-tech-backend.vercel.app/users/getuser/${idOfWaitingFriend}`)
          )
        );

        const friendsData = requests.map((r) => r.data.user);
        setUserFriends(friendsData);
      } catch (err) {
        console.log(err);
        setMessage("There is a problem while getting your data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>

      {loading ? (
        <div className="loadingIndicator">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="req">
          {message && <Message messageText={message} />}
          <h1 className="heading">Friend Requests</h1>
          <div className="reqs">
            <div className="backbtn">
              <button>
                <Link className="txt" to="/">
                  Back To Home
                </Link>
              </button>
            </div>

            {userFriends.length > 0 ? (
              userFriends.map((friend) => (
                <div key={friend._id} className="friend-card">
                  <div className="profile-data">
                    <img src={friend.avatar} alt="no.img" />
                    <h2>{friend.name}</h2>
                  </div>
                  <div className="actions">
                    <button
                      className="accept-btn"
                      onClick={() => acceptReq(friend._id)} // ✅ callback
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => rejectReq(friend._id)} // ✅ callback
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No friend requests found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Req;
