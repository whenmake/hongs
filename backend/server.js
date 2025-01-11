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
const seedDatabase = require("./models/DBinit");

connectDB().then(() => {

});

// 환경 변수에서 MongoDB URI 가져오기
// const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
// const mongoURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<databaseName>?retryWrites=true&w=majority';
// const mongoUri = 'mongodb+srv://hongsdb:GHDTMelql1@cluster0.mongodb.net/reading?retryWrites=true&w=majority';
const mongoURI = 'mongodb+srv://hongsdb:GHDTMelql1@cluster0.fa8vd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

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

mongoose
  .connect(mongoURI, {
  })
  .then(() => {
    console.log('MongoDB Atlas 연결 성공');
    seedDatabase(); // 데이터베이스 초기화}))}
  })
  .catch((err) => console.error('MongoDB Atlas 연결 실패:', err));

  
// 서버 실행
app.listen(5000, () => {
  console.log("서버가 5000번 포트에서 실행 중입니다.");
});

