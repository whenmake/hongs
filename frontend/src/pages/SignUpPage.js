import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [nickname, setNickname] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleNicknameChange = (e) => setNickname(e.target.value);

  // 닉네임 중복 확인
  const checkNickname = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/check-nickname-duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();
      setIsDuplicate(!data.available); // 닉네임 중복 여부
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
    }
  };

  // 닉네임 저장
  const handleSignup = async () => {
    if (isDuplicate || !nickname.trim()) {
      alert("유효하지 않은 닉네임입니다.");
      return;
    }
  
    try {
      const user = auth.currentUser; // Firebase에서 현재 로그인한 사용자 가져오기
      await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, nickname }),
      });
  
      // 회원가입 후 메인 페이지로 이동
      navigate("/main");
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">닉네임 생성</h1>
      <input
        type="text"
        value={nickname}
        onChange={handleNicknameChange}
        placeholder="닉네임 입력"
        className="border px-4 py-2 rounded-md mb-4"
      />
      <button
        onClick={checkNickname}
        className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4"
      >
        닉네임 중복 확인
      </button>
      {isDuplicate && <p className="text-red-500">닉네임이 중복됩니다.</p>}
      <button
        onClick={handleSignup}
        className="bg-blue-500 text-white px-6 py-2 rounded-md"
      >
        닉네임 생성 완료
      </button>
    </div>
  );
};

export default SignupPage;
