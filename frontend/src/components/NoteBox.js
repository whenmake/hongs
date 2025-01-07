import React from "react";

const NoteBox = ({ note, onLike, delNote, currentUser }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mb-4">
      {/* 노트 컨텐츠 */}
      <p className="text-gray-800 text-lg mb-4">{note.content}</p>

      <div className="flex items-center justify-between">
        {/* 작성 시간 */}
        <span className="text-sm text-gray-500">
          {new Date(note.createdAt).toLocaleString()} {/* 작성 시간 포맷 */}
        </span>

        {/* 버튼 영역 */}
        <div className="flex items-center justify-end gap-2">
          {/* 좋아요 버튼 */}
          <button
            onClick={() => onLike(note._id)} // 좋아요 클릭 이벤트
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition items-center justify-center space-x-3" //flex flex-col
          >
            {/* 버튼 텍스트 */}
            <span className="text-md">좋아요</span>
            {/* 좋아요 숫자 */}
            <span className="text-xl font-bold mb-1">{note.likes}</span>
          </button>

          {/* 삭제 버튼: 작성자만 표시 */}
          {note.nickname === currentUser && (
            <button
              onClick={() => delNote(note._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteBox;
