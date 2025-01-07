const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User 모델 가져오기

// /api/signup 라우트
router.post("/", async (req, res) => {
  const { uid, nickname } = req.body;

  // 요청 데이터 검증
  if (!uid || !nickname) {
    return res.status(400).json({ message: "UID와 닉네임이 필요합니다." });
  }

  try {
    // UID로 이미 가입된 유저가 있는지 확인
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(409).json({ message: "이미 가입된 사용자입니다." });
    }

    // 닉네임 중복 확인
    const nicknameExists = await User.findOne({ nickname });
    if (nicknameExists) {
      return res.status(409).json({ message: "닉네임이 이미 사용 중입니다." });
    }

    // 새 사용자 생성
    const newUser = new User({ uid, nickname });
    await newUser.save();

    res.status(201).json({ message: "회원가입 성공", user: newUser });
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
