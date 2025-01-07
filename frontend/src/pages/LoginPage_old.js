


import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import app from "../firebase"; // Firebase 초기화한 파일 import
import { useNavigate } from "react-router-dom";
import axios from "axios"; // DB 확인을 위한 axios import

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(""); // 닉네임 추가
  const navigate = useNavigate();

  const auth = getAuth(app); // Firebase 앱에서 Auth 가져오기

   // 브라우저에 로그인된 계정 확인 및 자동 로그인
   useEffect(() => {
    const checkUser = async () => {
      onAuthStateChanged(auth, async (user) => {
        // 사용자 인증 상태 확인
        if (user && user.email) {
          try {
            // DB에서 사용자 존재 여부 확인
            const response = await axios.post("http://localhost:5000/api/auth/check", {
              email: user.email,
            });
  
            if (response.data.exists) {
              const { nickname } = response.data;
  
              // 닉네임과 이메일을 localStorage에 저장
              localStorage.setItem("nickname", nickname);
              localStorage.setItem("email", user.email);
  
              alert(`${nickname}님, 자동 로그인 성공!`);
              navigate("/main"); // 메인 페이지로 이동
            } else {
              // DB에 사용자가 없으면 로그아웃 처리
              alert("등록되지 않은 계정입니다. 회원가입이 필요합니다.");
              auth.signOut(); // 로그아웃 처리
            }
          } catch (error) {
            console.error("자동 로그인 체크 실패:", error);
            alert("자동 로그인 실패");
          }
        } else {
          console.log("사용자가 브라우저에 로그인되어 있지 않습니다.");
        }
      });
    };
  
    checkUser();
  }, [auth, navigate]);
  
  // 로그인 처리
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      navigate("/main"); // 로그인 성공 시 메인 페이지로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패");
    }
  };

  const handleSignup = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <input
        type="email"
        placeholder="이메일"
        className="mb-2 p-2 border rounded w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="mb-4 p-2 border rounded w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          로그인
        </button>
        <button
          onClick={handleSignup}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          회원가입
        </button>
    </div>
  );
};

export default LoginPage;

