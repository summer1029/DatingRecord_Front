import React from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from './RegisterForm';

export default function Register() {
  const navigate = useNavigate()

  const handleSubmit = async (name, email, password) => {
    try {
      if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
        alert("Email address, password, name and birth cannot be empty!");
        return;
      }

      const response = await fetch("http://192.168.10.151:8080/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
                  nm : name,
                  userEmail : email,
                  password : password,
                }),
      })

      console.log("Request Body:", { nm: name, userEmail: email, password: password });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "회원가입 실패");
        return;
      }
      
      const data = await response.json();
      console.log("회원가입 성공 데이터:", data);
      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/Login");
    } catch (error) {
      console.error("에러 발생:", error);
      alert("회원가입 중 에러가 발생했습니다.");
    }
  }
  return <RegisterForm onSubmit={handleSubmit} />;
}
