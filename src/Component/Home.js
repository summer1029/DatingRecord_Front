import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';  // react-router-dom에서 import
import { stLogin } from './AtomSt';
import { useRecoilValue } from 'recoil';
import Login from './Account/Login';
import Search from './Friend/Search';
import KakaoMapLoader from './KakaoMap/KakaoMapLoader';
import MyMap from './KakaoMap/Mymap';
import CalendarView from './Calendar/CalendarView';
import FriendList from './Friend/FriendList';
import FriendsPage from './Friend/FriendsPage';

export default function Home() {

  const isLogin = useRecoilValue(stLogin)  // Recoil 상태값 읽기
  const [friends, setFriends] = useState([]) // 로그인한 사용자의 친구 목록
  const acceptedFriends = friends.filter(f => f.status === 'ACCEPTED'); // 친구 수 
  const pendingResponse = friends.filter(f => f.status === 'PENDING' && f.sentByMe); // 내가 요청한 친구 수 
  const pendingRequests = friends.filter(f => f.status === 'PENDING' && !f.sentByMe); // 나에게 요청한 친구 수

  const navigate = useNavigate()
  const navigateToMemberUpdate = () => {
    navigate("/MemberUpdate")
  }
  const navigateToRegister = () => {
    navigate("/Register")
  }

  // 로그인 false일 때 초기화
  useEffect(() => {
    if (!isLogin) {
      setFriends([]);
    }
  }, [isLogin]);

  return (
    <nav className='px-5 py-3'>
      <div className='flex justify-center items-center'>
        <div className="text-2xl font-bold p-1.5 w-1/3">Dating Record</div>

        <div className='w-1/3 p-1.5'>
          {/* 친구 검색바 */}
          <Search />
        </div>

        <div className='flex items-center justify-end w-1/3'>
          {/* 로그인 버튼 */}
          <Login />

          {/* 회원가입 버튼 */}
          {/* 로그인 된 상태에서는 회원가입 버튼이 보이지 않음 */}
          {!isLogin &&
            // <Link to = '/Register'>
            //    Register
            // </Link>
            <button className='block lg:inline-block p-1 mr-3 border rounded text-base font-appleB text-black border-black hover:text-red-400 hover:bg-white hover:border-red-400'
              onClick={navigateToRegister}>
              회원가입
            </button>
          }

          {/* 회원정보 수정 버튼 */}
          {/* 로그인 된 상태에서만 회원정보 수정 버튼이 보임 */}
          {isLogin &&
            // <Link to = '/MemberUpdate'>
            //   회원정보수정
            // </Link>
            <button className='block lg:inline-block p-1 mr-3 border rounded text-base font-appleB text-black border-black hover:text-red-400 hover:bg-white hover:border-red-400'
              onClick={navigateToMemberUpdate}>
              회원정보수정
            </button>
          }
        </div>
      </div>

      <div className='flex justify-center items-center h-60'>
        {/* 친구 검색바
        <Search /> */}
        <div className='w-1/2 border rounded-lg p-2 mt-3 h-full'>
          {/* 내 친구 목록 */}
          {/* FriendPage에 Props로 넘기기 */}
          <FriendsPage friends={friends} setFriends={setFriends} />
        </div>
        <div className='w-1/2 border rounded-lg p-2 mt-3 ml-3 h-full flex justify-between items-center'>
          <div className='w-full'>
          <h2 className='text-start text-xl mb-3'>친구 요청 현황</h2>
            <table className='w-full'>
              <tbody>
                <tr>
                  <th className="text-left border px-4 py-2 bg-gray-100 w-1/2">이름</th>
                  <td className="border px-4 py-2">{localStorage.getItem("userName")}</td>
                </tr>
                <tr>
                  <th className="text-left border px-4 py-2 bg-gray-100">친구 수</th>
                  <td className="border px-4 py-2">{acceptedFriends.length}명</td>
                </tr>
                <tr>
                  <th className="text-left border px-4 py-2 bg-gray-100">친구 요청 수</th>
                  <td className="border px-4 py-2">{pendingResponse.length}명</td>
                </tr>
                <tr>
                  <th className="text-left border px-4 py-2 bg-gray-100">받은 친구 요청 수</th>
                  <td className="border px-4 py-2">{pendingRequests.length}명</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <div className='flex mt-3'>
        <div className='w-1/2 border rounded-lg p-2'>
          <KakaoMapLoader>
            <MyMap />
          </KakaoMapLoader>
        </div>

        <div className='ml-3 w-1/2 border rounded-lg p-2'>
          <CalendarView />
        </div>
      </div>
    </nav>
  )
}
