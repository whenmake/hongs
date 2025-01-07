// // src/components/ChapterGrid.js
// import React, { useState, useEffect } from "react";
// import bibleData from "../data/data.json"; // JSON 데이터 경로

// const ChapterGrid = ({ completed, onChapterClick }) => {
//   const [gridItems, setGridItems] = useState([]); // 그리드 아이템 상태

//   useEffect(() => {
//     const loadBibleData = () => {
//       try {
//         const items = [];

//         // JSON 데이터 첫 번째 줄 처리
//         const introItem = bibleData[0]; // 첫 번째 데이터 가져오기
//         const isEmpty =
//           !introItem["1일차"] &&
//           !introItem["2일차"] &&
//           !introItem["3일차"] &&
//           !introItem["4일차"] &&
//           !introItem["5일차"] &&
//           !introItem["6일차"]; // 7칸 중 빈 값 확인

//         if (isEmpty) {
//           // 7칸이 빈 경우 첫 번째 칸에 "성경" 값 넣고 통합
//           items.push({
//             merged: true, // 통합 여부
//             content: introItem["성경"], // 성경 값을 표시
//             index: 0, // 구약개관에 고유 인덱스를 부여
//           });
//         }

//         // 나머지 데이터 처리
//         bibleData.slice(1).forEach((week, weekIndex) => {
//           items.push({ merged: false, content: week["성경"], index: weekIndex * 7 + 1 }); // 첫 번째 칸: 성경 이름
//           items.push({ merged: false, content: week["1일차"], index: weekIndex * 7 + 2 });
//           items.push({ merged: false, content: week["2일차"], index: weekIndex * 7 + 3 });
//           items.push({ merged: false, content: week["3일차"], index: weekIndex * 7 + 4 });
//           items.push({ merged: false, content: week["4일차"], index: weekIndex * 7 + 5 });
//           items.push({ merged: false, content: week["5일차"], index: weekIndex * 7 + 6 });
//           items.push({ merged: false, content: week["6일차"], index: weekIndex * 7 + 7 });
//         });

//         setGridItems(items.filter((item) => item !== null)); // null 값 필터링
//       } catch (error) {
//         console.error("성경 데이터 로드 실패:", error);
//       }
//     };

//     loadBibleData();
//   }, []);

//   return (
//     <div className="p-4">
//       <div className="grid grid-cols-7 gap-4">
//         {gridItems.map((item, index) =>
//           item.merged ? (
//             // 통합된 칸            
//             <div
//               key={index}
//               className={`p-4 rounded-lg border text-center col-span-7 font-bold cursor-pointer ${
//                 completed[0] ? "bg-green-100" : "bg-gray-100"
//               }`}
//               onClick={() => onChapterClick(0)} // 클릭 이벤트, 통합 칸은 index 0으로 설정
//             >
//               {item.content}
//           </div>
          
//           ) : (
//             // 개별 칸
//             <div
//               key={index}
//               className={`p-4 rounded-lg border ${
//                 completed[item.index] ? "bg-green-100" : "bg-gray-100"
//               } cursor-pointer text-center`}
//               onClick={() => onChapterClick(item.index)} // 클릭 이벤트 추가
//             >
//               {item.content || "내용 없음"}
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChapterGrid;

// src/components/ChapterGrid.js
import React, { useState, useEffect } from "react";
import bibleData from "../data/data.json"; // JSON 데이터 경로

const ChapterGrid = ({ completed, onChapterClick }) => {
  const [gridItems, setGridItems] = useState([]); // 그리드 아이템 상태

  useEffect(() => {
    const loadBibleData = () => {
      try {
        const items = [];

        // JSON 데이터 첫 번째 줄 처리
        const introItem = bibleData[0]; // 첫 번째 데이터 가져오기
        const isEmpty =
          !introItem["1일차"] &&
          !introItem["2일차"] &&
          !introItem["3일차"] &&
          !introItem["4일차"] &&
          !introItem["5일차"] &&
          !introItem["6일차"]; // 7칸 중 빈 값 확인

        if (isEmpty) {
          // 7칸이 빈 경우 첫 번째 칸에 "성경" 값 넣고 통합
          items.push({
            merged: true, // 통합 여부
            content: introItem["성경"], // 성경 값을 표시
            index: 0, // 구약개관에 고유 인덱스를 부여
          });
        }

        // 나머지 데이터 처리
        bibleData.slice(1).forEach((week, weekIndex) => {
          items.push({ merged: false, content: week["성경"], index: weekIndex * 7 + 1 }); // 첫 번째 칸: 성경 이름
          items.push({ merged: false, content: week["1일차"], index: weekIndex * 7 + 2 });
          items.push({ merged: false, content: week["2일차"], index: weekIndex * 7 + 3 });
          items.push({ merged: false, content: week["3일차"], index: weekIndex * 7 + 4 });
          items.push({ merged: false, content: week["4일차"], index: weekIndex * 7 + 5 });
          items.push({ merged: false, content: week["5일차"], index: weekIndex * 7 + 6 });
          items.push({ merged: false, content: week["6일차"], index: weekIndex * 7 + 7 });
        });

        setGridItems(items.filter((item) => item !== null)); // null 값 필터링
      } catch (error) {
        console.error("성경 데이터 로드 실패:", error);
      }
    };

    loadBibleData();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-4">
        {gridItems.map((item, index) =>
          item.merged ? (
            // 통합된 칸            
            <div
              key={index}
              className={`p-4 rounded-lg border text-center col-span-7 font-bold cursor-pointer ${
                completed[0] ? "bg-green-100" : "bg-gray-100"
              }`}
              onClick={() => onChapterClick(0, item.content)} // 클릭 이벤트, 통합 칸은 index 0으로 설정
            >
              {item.content}
            </div>
          ) : (
            // 개별 칸
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                completed[item.index] ? "bg-green-100" : "bg-gray-100"
              } cursor-pointer text-center`}
              onClick={() => onChapterClick(item.index, item.content)} // 클릭 시 값 전달
            >
              {item.content || "내용 없음"}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChapterGrid;
