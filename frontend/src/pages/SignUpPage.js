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
      const response = await fetch("https://hongs.onrender.com/api/check-nickname-duplicate", {
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
      const currentUser = auth.currentUser; // 현재 사용자 가져오기

      if (!currentUser) {
        console.error("사용자가 인증되지 않았습니다.");
        alert("로그인 후 회원가입을 진행해주세요.");
        return;
      }

      const uid = currentUser.uid; // 사용자 uid 가져오기
      const response = await fetch("https://hongs.onrender.com/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          nickname,
        }),
      });

      if (!response.ok) {
        throw new Error("회원가입 요청 실패");
      }

      const data = await response.json();
      console.log("회원가입 성공:", data);

      alert("회원가입이 완료되었습니다!");
      navigate("/main", { state: { nickname } });
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  //     const user = auth.currentUser; // Firebase에서 현재 로그인한 사용자 가져오기
  //     await fetch("https://hongs.onrender.com/api/signup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ uid: user.uid, nickname }),
  //     });
  
  //     // 회원가입 후 메인 페이지로 이동
  //     navigate("/main");
  //   } catch (error) {
  //     console.error("회원가입 실패:", error);
  //   }
  // };
  
  

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
