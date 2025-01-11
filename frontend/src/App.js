import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";

const [nickname, setNickname] = useState("");

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 경로에서 로그인 페이지를 보여줍니다 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage nickname={nickname} />} />        
      </Routes>
    </Router>
  );
};

export default App;
