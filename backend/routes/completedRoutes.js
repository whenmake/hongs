const express = require("express");
const router = express.Router();
const Completed = require("../models/Completed");

// 완료 상태 저장
router.post("/", async (req, res) => {
  const { index, status, nickname } = req.body;
  console.log("index, status, nickname:", { index, status, nickname });

  if (index === undefined || status === undefined || !nickname) {
    return res.status(400).json({ error: "Invalid data format or missing nickname" });
  }

  try {
    // 데이터베이스에서 기존 항목 확인
    console.log("데이터베이스에서 기존 항목 확인");

    const existingRecord = await Completed.findOne({ index, nickname });
    // res.json(existingRecord);

    if (existingRecord) {
        // 기존 항목 업데이트
        try {
          await Completed.updateOne(
            { index, nickname }, // 조건
            { $set: { status } } // 변경할 필드
          );
          console.log("기존 항목 업데이트");
        } catch (error) {
          console.error("기존 항목 업데이트 실패:", error);
        }      
    } else {
      // 새로운 항목 추가
      const newCompleted = new Completed({ index, status, nickname });
      await newCompleted.save();
      console.log("새로운 항목 추가");
    }

    res.status(200).json({ message: "완독 상태 저장 성공" });
  } catch (error) {
    console.error("완독 상태 저장 실패:", error);
    res.status(500).json({ error: "완독 상태 저장 실패" });
  }
});

// 완료 상태 조회
router.get("/", async (req, res) => {
  const { nickname } = req.query; // 클라이언트에서 전달된 닉네임 가져오기
  console.log("완료상태 조회 닉네임:", nickname);
  if (!nickname) {
    return res.status(400).json({ error: "nickname 파라미터가 필요합니다." });
  }

  try {
    // nickname 기반으로 완료 상태 조회
    const completedRecords = await Completed.find({ nickname });
    res.status(200).json(completedRecords);
    console.log("닉네임 완료상태 조회:", completedRecords);

    
  } catch (error) {
    console.error("완독 상태 조회 실패:", error);
    res.status(500).json({ error: "완독 상태 조회 실패" });
  }
});

module.exports = router;
