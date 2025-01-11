import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase 초기화된 auth 객체 가져오기


const LoginPage = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  // Google 로그인 처리
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google 로그인 성공:", user);
      checkNickname(user); // 닉네임 확인
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    }
  };

  // Apple 로그인 처리
  const handleAppleLogin = async () => {
    const provider = new OAuthProvider("apple.com");
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Apple 로그인 실패:", error);
    }
  };

  // 닉네임 확인
  const checkNickname = async (user) => {
    try {
      const response = await fetch(`https://hongs.onrender.com/api/check-nickname?uid=${user.uid}`);
      const data = await response.json();
      console.log("닉네임 체크 결과:", data);

      if (data.hasNickname) {
        // setNickname(response.data.nickname); // nickname 상태 저장
        setNickname(data.nickname);

        // 닉네임이 있으면 메인페이지로 이동
        navigate("/main");
      } else {
        console.error("닉네임이 설정되지 않았습니다.");
        // 닉네임이 없으면 회원가입 페이지로 이동
        navigate("/signup");
      }
    } catch (error) {
      console.error("닉네임 확인 실패:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-md mb-4"
        onClick={handleGoogleLogin}
      >
        구글로 로그인
      </button>
      {/* <button
        className="bg-gray-800 text-white px-6 py-2 rounded-md"
        onClick={handleAppleLogin}
      >
        애플 아이디로 로그인
      </button> */}
    </div>
  );
};

export default LoginPage;
