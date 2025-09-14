import { Route, Routes } from 'react-router-dom';
import './App.css';
import Account from './components/account/account';
import AddPost from './components/addPost/Add';
import Find from './components/findAccount/Find';
import Home from './components/home/Home';
import Join from './components/join/Join';
import Req from './components/requests/Req';
import WelcomePage from './components/Welcome/Welcome';


function App() {
  const userId = window.localStorage.getItem('id');
  return (
    <div className="container">
      {!userId ?
      <Routes>
        <Route path='/' element={<WelcomePage />}/>
        <Route path="/join" element={<Join />} />
        <Route path="/findaccount" element={<Find />} />
      </Routes>
      :
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addpost" element={<AddPost />} />
        <Route path="/account/:id" element={<Account />} />
        <Route path="/requests" element={<Req />} />
      </Routes>

      }
    </div>
  )
}

export default App
