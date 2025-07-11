import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './App.css';
import Home from './Component/Home'
import Register from './Component/Account/Register';
import LoginForm from './Component/Account/LoginForm';
import MemberUpdateForm from './Component/Account/MemberUpdateForm';
import Search from './Component/Friend/Search';
import MyFriends from './Component/Friend/MyFriends';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<LoginForm />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/MemberUpdate' element={<MemberUpdateForm />} />
          <Route path='/Search' element={<Search />} />
          <Route path='/MyFriends' element={<MyFriends />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
