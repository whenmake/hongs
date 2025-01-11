const User = require("./User");
const Note = require("./Note");
const Completed = require("./Completed");

const seedDatabase = async () => {
    try {
        // User DB 초기화
        const existingUser = await User.findOne({ uid: "sampleUid" });

        if (!existingUser) {
            console.log("User 기본 데이터를 추가합니다...");
            await User.create({
                uid: "sampleUid",
                nickname: "sampleNickname",
            });
            console.log("User 기본 데이터가 추가되었습니다.");
        } else {
            console.log("User 기본 데이터가 이미 존재합니다.");
        }

        // Note DB 초기화
        const existingNote = await Note.findOne({ index: 0 });

        if (!existingNote) {
            console.log("Note 기본 데이터를 추가합니다...");
            await Note.create({
                index: 0,
                content: "기본 노트 내용",
                nickname: "sampleNickname",
                createdAt: Date.now(), // 노트 작성 시간 필드 추가
                likes: 0 ,
                likedBy: [] , // 좋아요를 누른 사용자 ID 목록
            });
            console.log("Note 기본 데이터가 추가되었습니다.");
        } else {
            console.log("Note 기본 데이터가 이미 존재합니다.");
        }

        // Completed DB 초기화
        const existingCompleted = await Completed.findOne({ index: 0 });

        if (!existingCompleted) {
            console.log("Completed 기본 데이터를 추가합니다...");
            await Completed.create({
                index: 0,
                status: false,
                nickname: "sampleNickname",
            });
            console.log("Completed 기본 데이터가 추가되었습니다.");
        } else {
            console.log("Completed 기본 데이터가 이미 존재합니다.");
        }
    } catch (error) {
        console.error("데이터베이스 초기화 중 오류 발생:", error);
    }
};

module.exports = seedDatabase;
