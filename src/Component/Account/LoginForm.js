import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { stLogin, userInfo } from '../AtomSt'
import { Navigate, useNavigate } from 'react-router-dom'

export default function LoginForm() {

  const [inputId, setInputId] = useState("")
  const [inputPw, setInputPw] = useState("")

  // 로그인 상태 변수
  const [isLogin, setIsLogin] = useRecoilState(stLogin)

  // 로그인 한 사용자 이름 변수
  const [userName, setUserName] = useRecoilState(userInfo)

  const navigate = useNavigate()

  const handleInputId = (e) => {
    setInputId(e.target.value)
  }

  const handleInputPw = (e) => {
    setInputPw(e.target.value)
  }

  const handleSubmit = () => {
    console.log("id: ", inputId, "pw: ", inputPw)

    // 로그인 시, back에 아이디와 비밀번호 post
    fetch("http://192.168.10.151:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: inputId,
        password: inputPw,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // 서버의 DB랑 비교해서 서버에서부터 응답을 받으면
          const accessToken = response.headers.get("Authorization");
          localStorage.setItem("loginToken", accessToken);
        
          return response.json();
        } else {
          alert("Invalid email and password");
          throw new Error("Invalid credentials");
        }
      })
      .then((data) => {
        console.log("로그인 데이터", data);
        // 로그인 성공 처리
        setIsLogin(true);
        setUserName({name : data.username})
        localStorage.setItem("userName", data.username)

        // 로그인 성공 시, home 페이지로 이동
        if (data.message === "로그인 성공") {
          navigate("/")
        }
      })
      .catch((err) => {
        console.error("Error logging in:", err);
      });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className='border border-gray-400 rounded-lg p-10'>
          <div className="flex items-center text-2xl font-semibold text-gray-900">Dating Record</div>

          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mt-3">
            Dating Record에 로그인하세요
          </h1>
          {/* 아이디 */}
          <div className='mt-3'>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">아이디</label>
            <input placeholder='email' type="email" value={inputId} onChange={handleInputId}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5" />
          </div>
          {/* 비밀번호 */}
          <div className='mt-3'>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">비밀번호</label>
            <input placeholder="••••••••" value={inputPw} onChange={handleInputPw}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5" />
          </div>


          {/* 로그인 버튼 */}
          <button onClick={() => handleSubmit()}
            className="w-full text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5">
            Login
          </button>
        </div>
        <div>

        </div>
      </div>
      <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/Img/loginImage.jpg')" }}>
        {/* Optional: 이미지 위에 텍스트나 오버레이도 가능 */}
      </div>
    </div>
  )
}
