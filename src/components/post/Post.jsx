import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Message from '../message/Message';
import './post.css';
const Post = ({
  id,
  filmtitle,
  filmrate,
  myopinion,
  category,
  filmimage,
  comments,
  likes,
  name,
  avatar,
  userid,
  reloadPost
}) => {
  const [message, setMessage] = useState(null);
  const [postLikes, setPostLikes] = useState(likes); // لا نعدل props مباشرة
  const [postComments, setPostComments] = useState(comments); // لا نعدل props مباشرة
  const commentsContainer = useRef();
  const addcomment = useRef();
  const commentbtn = useRef();
  const navigate = useNavigate()
  console.log({  id,
  filmtitle,
  filmrate,
  myopinion,
  category,
  filmimage,
  comments,
  likes,
  name,
  avatar,
  userid,})
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  const likePost = ()=> {
    const response = axios.post(`https://film-tech-backend.vercel.app/posts/likepost/${id}/${window.localStorage.getItem("id")}`);
    response.then((res)=> {
      console.log(res);
      setMessage(res.data.message);
      console.log(res.data);
      setPostLikes(res.data.post.likes)
    }).catch((err)=>{
      console.log(err);
      setMessage("Error While Adding A Like")
    })
  }

  const addcommentfunc = ()=> {
    if(addcomment.current.value == ""){
      return alert("Can't be An Empty Comment");
    }

    const body = {
      message: "addcomment.current.value"
    }
    const value = addcomment.current.value;
    addcomment.current.value = ""
    commentbtn.current.textContent = "Loading"
    const res = axios.post(`https://film-tech-backend.vercel.app/posts/commentpost/${id}/${window.localStorage.getItem("id")}`, {comment: value});
    res.then((res)=>{
      console.log(res.data)
      commentbtn.current.textContent = "Add Comment";
      setPostComments(res.data.post.comments);
   })
  }

  return (
    <div className="post">
      {message && <Message messageText={message} />}
      <div className="post-header" onClick={()=>{navigate(`/account/${userid}`)}}>
        <img className="post-avatar" src={avatar} alt="User Avatar" />
        <div>
          <h3>{name}</h3>
          <p className="post-category">Category: {category}</p>
        </div>
      </div>

      <div className="post-body">
        <img className="post-image" src={filmimage} alt={filmtitle} />
        <h2 className="post-title">{filmtitle}</h2>
        <p className="post-rate">My Rate ⭐ {filmrate}/10</p>
        <p className="post-opinion">“{myopinion}”</p>
      </div>

      <div className="post-footer">
        <span>
          <span className='like-icon' onClick={likePost}>👍</span> {postLikes.length}
        </span>
        <span><span className='comment-icon' onClick={()=>commentsContainer.current.classList.toggle("none")}>💬</span> {postComments.length}</span>
        <div className="comments-container none" ref={commentsContainer}>
          <div className="comments">
            <span className="Close-tap" onClick={()=>commentsContainer.current.classList.toggle("none")} >X</span>
            <div className="comments-bar">

          {postComments.map((e) => (
            <>
            <div className="comment">
        <div className="commentHead" key={e.comment}>
          <img src={e.user.avatar} alt="img" />
          <h4>{e.user.name}</h4>
        </div>
        <div className="comment-info">
          <h3>{e.comment}</h3>
        </div>
        </div>
      </>
      ))}
      </div>
      <div className="add-com">
      <input className="addComment" ref={addcomment} placeholder="Add A Comment" type="text"/>
      <button ref={commentbtn} onClick={addcommentfunc}>Add Comment</button>
      </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
