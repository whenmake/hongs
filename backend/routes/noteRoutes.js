// routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// 노트 가져오기 라우트
// router.get("/", async (req, res) => {
//   try {
//     const notes = await Note.find();
//     res.json(notes);
//   } catch (error) {
//     res.status(500).send("노트 로드 실패");
//   }
// });
// 특정 날짜의 모든 노트 가져오기
router.get("/", async (req, res) => {
  const { index } = req.query;

  if (!index) {
    return res.status(400).json({ message: "index 파라미터가 필요합니다." });
  }

  try {
    const notes = await Note.find({ index: parseInt(index, 10) }).sort({ createdAt: -1 });

    if (notes.length === 0) {
      // 노트가 없는 경우 빈 배열 반환
      return res.status(200).json([]);
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error("노트 데이터 불러오기 실패:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 노트 저장 라우트
router.post("/save", async (req, res) => {
  const { index, content, nickname } = req.body;

   console.log("노트 저장 요청:", { index, content, nickname }); // 디버깅용 로그
   console.log("노트 저장 요청:", res); // 디버깅용 로그
  if (!index || !content || !nickname) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

   // 데이터 검증
  if (typeof nickname !== "string" || !nickname.trim()) {
    return res.status(400).json({ message: "Invalid nickname" });
  }
  
  try {
    const note = new Note({
      index,
      content,
      nickname,
    });
    
  await note.save();
  res.status(200).json(note); // 업데이트된 노트를 반환
} catch (error) {
  console.error("좋아요 처리 실패:", error);
  res.status(500).json({ message: "Internal server error" });
}
});

// 노트 삭제 라우트
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).send("노트 삭제 성공");
  } catch (error) {
    res.status(500).send("노트 삭제 실패");
  }
});

// 노트 좋아요 토글 API
router.post("/:id/like", async (req, res) => {
  const { id } = req.params;
  console.log("좋아요 처리 요청 ID:", id); // 디버깅용 로그
  // const { id } = req.body; // 요청에서 사용자 ID 가져오기
  const { nickname, like } = req.body;

  // nickname과 like 값 검증
  if (!nickname || typeof like !== "boolean") {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    // const id = req.params.id || req.body.id; // 요청에서 id를 가져옴
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (like) {
      // 좋아요 추가
      if (!note.likedBy.includes(nickname)) {
        note.likedBy.push(nickname); // likedBy에 사용자 추가
        note.likes += 1; // 좋아요 수 증가
      }
    } else {
      // 좋아요 취소
      if (note.likedBy.includes(nickname)) {
        note.likedBy = note.likedBy.filter((user) => user !== nickname); // likedBy에서 사용자 제거
        note.likes -= 1; // 좋아요 수 감소
      }
    }

    // 잘못된 데이터 필터링
    note.likedBy = note.likedBy.filter(
      (user) => typeof user === "string" && user.trim() !== ""
    );

    await note.save();
    res.status(200).json(note); // 업데이트된 note 반환
  } catch (error) {
    console.error("Error handling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

