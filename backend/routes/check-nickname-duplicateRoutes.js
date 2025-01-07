const express = require("express");
const router = express.Router();
const User = require("../models/User"); // User 모델 가져오기

// 닉네임 중복 확인 라우트
router.post("/", async (req, res) => {
  const { nickname } = req.body;

  if (!nickname) {
    return res.status(400).json({ message: "닉네임이 필요합니다." });
  }

  try {
    // 닉네임 중복 확인
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      return res.status(409).json({ available: false }); // 닉네임이 중복됨
    }

    res.status(200).json({ available: true }); // 닉네임 사용 가능
  } catch (error) {
    console.error("닉네임 중복 확인 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
