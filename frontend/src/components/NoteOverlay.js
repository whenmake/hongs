// src/components/NoteOverlay.js
import React from "react";

const NoteOverlay = ({ notes, onSave }) => {
  const [content, setContent] = React.useState("");
  const handleSaveClick = () => {
    if (!content.trim()) {
      alert("노트 내용을 입력하세요.");
      return;
    }
    onSave(content);
    setContent(""); // 저장 후 텍스트박스 초기화
  };

  return (
    <div>
      <textarea
        className="w-full h-40 border rounded p-2"
        placeholder="노트를 작성하세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleSaveClick}
      >
        저장하기
      </button>     
    </div>
  );
};

export default NoteOverlay;
