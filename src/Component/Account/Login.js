import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { stLogin } from '../AtomSt'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    // 로그인 상태 확인하는 변수
    const [isLogin, setIsLogin] = useRecoilState(stLogin)
    console.log("로그인 상태: ", isLogin)

    const navigate = useNavigate()
    const navigateToLogin = () => {
        navigate("/Login")
    }

    useEffect(() => {
        const loginToken = localStorage.getItem("loginToken")
        // 로그인 토큰이 있으면 로그인 된 상태
        if (loginToken) {
            setIsLogin(true)
        }
    }, [setIsLogin])

    const handleLogout = () => {
        localStorage.removeItem("loginToken");
        setIsLogin(false);
        navigate("/");
      }

  return (
    <div>
        {/* 로그인이 되면 stLogin이 true가 되면 Logout 버튼으로 변경 */}
        {isLogin ? <button className='block lg:inline-block p-1 mr-3 border rounded text-base font-appleB text-black border-black hover:text-red-400 hover:border-red-400 hover:bg-white' 
                           onClick={handleLogout}>
                                로그아웃
                    </button>
            //  로그인이 안된 상태이면(isLogin이 false가 되면) Loginform 페이지 띄우기
             : <button className='block lg:inline-block p-1 mr-3 border rounded text-base font-appleB text-black border-black hover:text-red-400 hover:border-red-400 hover:bg-white' 
                       onClick={navigateToLogin}>
                            로그인
                </button>
             } 
    </div>
  )
}
