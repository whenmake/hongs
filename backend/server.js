// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const completedRoutes = require("./routes/completedRoutes"); // 완료 상태 라우트
const checkNicknameRoutes = require("./routes/check-nicknameRoutes");
const checkduplicateRoutes = require("./routes/check-nickname-duplicateRoutes");
const signupRoutes = require("./routes/signupRoutes");
const app = express();

// 미들웨어
app.use(cors()); // CORS 활성화
app.use(express.json());
app.use(morgan("dev")); // 요청 로깅

// 라우트 등록
app.use("/api/auth", authRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/completed", completedRoutes); // 완료 상태 API 경로
app.use("/api/check-nickname", checkNicknameRoutes);
app.use("/api/check-nickname-duplicate", checkduplicateRoutes);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// MongoDB 연결
mongoose
  .connect("mongodb://127.0.0.1:27017/project", {
    
  })
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));


// 서버 실행
app.listen(5000, () => {
  console.log("서버가 5000번 포트에서 실행 중입니다.");
});

