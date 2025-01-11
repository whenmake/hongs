const User = require("./User");

const seedDatabase = async () => {
    try {
        const existingUser = await User.findOne({ uid: "sampleUid" });

        if (!existingUser) {
            console.log("기본 데이터를 추가합니다...");
            await User.create({
                uid: "sampleUid",
                nickname: "sampleNickname",
            });
            console.log("기본 데이터가 추가되었습니다.");
        } else {
            console.log("기본 데이터가 이미 존재합니다.");
        }
    } catch (error) {
        console.error("데이터베이스 초기화 중 오류 발생:", error);
    }
};

module.exports = seedDatabase;
