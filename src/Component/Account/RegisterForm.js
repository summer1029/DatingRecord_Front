import React, { useState } from 'react'

export default function RegisterForm({ onSubmit }) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleName = (e) => {
        setName(e.currentTarget.value)
    }

    const handleEmail = (e) => {
        setEmail(e.currentTarget.value)
    }

    const handlePassword = (e) => {
        setPassword(e.currentTarget.value)
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.currentTarget.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return alert('Confirmed password is wrong')
        }
        onSubmit(name, email, password);
    };

    return (
        <div className="flex h-screen">
            <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/Img/registerImage.jpg')" }}>
            </div>
            <div className="w-1/3 flex items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className='border border-gray-400 rounded-lg p-10'>
                    <div className="flex items-center text-2xl font-semibold text-gray-900">Dating Record</div>

                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mt-3">
                        Dating Record에 오신걸 환영합니다.
                    </h1>
                    {/* 이름 */}
                    <div className='mt-3'>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">아이디</label>
                        <input placeholder='name' value={name} onChange={handleName}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5" />
                    </div>
                    {/* 아이디 */}
                    <div className='mt-3'>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">아이디</label>
                        <input placeholder='email' value={email} onChange={handleEmail}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5" />
                    </div>
                    {/* 비밀번호 */}
                    <div className='mt-3'>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">비밀번호</label>
                        <input placeholder='password' value={password} onChange={handlePassword}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5" />
                    </div>
                    {/* 비밀번호 확인 */}
                    <div className='mt-3'>
                        <label htmlFor="passwordConfirm" className="block mb-2 text-sm font-medium text-gray-900">비밀번호 확인</label>
                        <input placeholder='password confirm' value={confirmPassword} onChange={handleConfirmPassword}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5" />
                    </div>

                    {/* 로그인 버튼 */}
                    <button onClick={handleSubmit}
                        className="w-full text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5">
                        회원가입
                    </button>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}
