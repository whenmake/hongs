

// import React, { useState } from "react";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// const SignupPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     const auth = getAuth();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert("회원가입 성공!");
//       navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
//     } catch (error) {
//       console.error("회원가입 실패:", error);
//       alert("회원가입 실패");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">회원가입</h1>
//       <input
//         type="email"
//         placeholder="이메일"
//         className="mb-2 p-2 border rounded w-64"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="비밀번호"
//         className="mb-4 p-2 border rounded w-64"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button
//         onClick={handleSignup}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         회원가입
//       </button>
//     </div>
//   );
// };

// export default SignupPage;


import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSignupWithGoogle = async () => {
    if (nickname.trim() === "") {
      alert("닉네임을 입력하세요!");
      return;
    }

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      // Google 인증 팝업
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 사용자 정보
      const email = user.email;

      // 백엔드로 닉네임과 이메일 전송
      await axios.post("http://localhost:5000/api/auth/signup", {
        nickname,
        email,
      });

      alert("회원가입 성공!");
      navigate("/main"); // 회원가입 성공 시 자동로그인, 메인인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <input
        type="text"
        placeholder="닉네임"
        className="mb-2 p-2 border rounded w-64"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button
        onClick={handleSignupWithGoogle}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        구글로 회원가입
      </button>
    </div>
  );
};

export default SignupPage;
