// // models/Note.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  index: Number,
  content: String,
  nickname: String,
  createdAt: { type: Date, default: Date.now }, // 노트 작성 시간 필드 추가
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] }, // 좋아요를 누른 사용자 ID 목록
});

noteSchema.pre("save", function (next) {
  // likedBy 배열에서 잘못된 값 제거
  this.likedBy = this.likedBy.filter(
    (user) => typeof user === "string" && user.trim() !== ""
  );
  next();
});  


module.exports = mongoose.model("Note", noteSchema);


// const express = require("express");
// const router = express.Router();
// const Note = require("../models/Note");

// router.get("/", async (req, res) => {
//   const { index } = req.query;
  
//   // index 값 검증
//   if (index === undefined || index === null) {
//     return res.status(400).json({ message: "index 파라미터가 필요합니다." });
//   }

//   try {
//     const notes = await Note.find({ index }); // index 값으로 노트 검색
//     res.status(200).json(notes);
//   } catch (error) {
//     console.error("노트 데이터 로드 중 오류:", error);
//     res.status(500).json({ message: "서버 오류" });
//   }
// });

// module.exports = router;
