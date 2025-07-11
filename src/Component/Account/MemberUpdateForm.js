import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function MemberUpdateForm() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // 기존 정보 불러오기
  useEffect(() => {
    fetch("http://192.168.10.151:8080/myinfo", {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("loginToken"),
      },
    })
      .then(res => res.json())
      .then(data => {
        setName(data.nm);
        setPassword(data.password); // 일반적으로는 비밀번호를 받아오지 않음 (보안상)
      })
      .catch(err => console.error("회원 정보 불러오기 실패", err));
  }, []);


  const handleMemberUpdate = () => {
    fetch("http://192.168.10.151:8080/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("loginToken"),
      },
      body: JSON.stringify({
        nm: name,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        alert("회원정보가 성공적으로 수정되었습니다!");

        if (data.message == "회원 정보가 업데이트되었습니다.") {
          navigate("/")
        }
      })
      .catch((err) => {
        console.error(err)
        alert("회원정보 수정을 실패하였습니다!");
      });
  }

  return (
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-red-400'>
      <div className='border border-gray-400 rounded-lg p-10 bg-white'>
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          회원정보수정
        </div>
        <div>
          <div className="text-lg font-bold leading-tight tracking-tight text-gray-900">
            이름 또는 비밀번호를 수정하시오
          </div>
          <div>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 mt-3'>이름: </label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5" />
            </div>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 mt-3'>비밀번호: </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
              />
            </div>
            <button onClick={handleMemberUpdate}
              className="w-full text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3">
              회원정보수정
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
