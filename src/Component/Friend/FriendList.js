import React from 'react';
import { Link } from 'react-router-dom';

function FriendList({ friends, setFriends }) {
  // friends: Array of FriendListDto 형태 (id, name, email, status)
  const handleAccept = (id) => {
    fetch(`http://192.168.10.151:8080/accept/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('loginToken'),
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('수락 요청 실패');
        }
        return res.json(); // 또는 res.text() → 서버 응답 형식에 따라
      })
      .then(data => {
        alert('친구 요청을 수락했습니다!');
        // 👉 UI 갱신을 위해 목록을 다시 불러오거나 상태 업데이트
        setFriends(prev =>
          prev.map(f =>
            f.id === id ? { ...f, status: 'ACCEPTED' } : f
          )
        );
      })
      .catch(err => {
        console.error('친구 수락 오류:', err);
        alert('친구 수락 실패: ' + err.message);
      });
  };

  const handleDeleteFriend = (id) => {
    fetch(`http://192.168.10.151:8080/delete/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('loginToken'),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('친구 삭제 실패');
        return res.json(); // 또는 .text()는 서버 응답 형태에 따라 조정
      })
      .then((data) => {
        alert('친구가 삭제되었습니다.');
        setFriends(prev => prev.filter(f => f.id !== id)); // 목록에서 제거
      })
      .catch((err) => {
        console.error('삭제 오류:', err);
        alert('삭제 실패: ' + err.message);
      });
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-center text-xl mb-3'>내 친구 목록</h2>
        <Link to="/MyFriends">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 fill-black mb-3">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
        </Link>
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">이름</th>
            <th className="px-4 py-2 border">이메일</th>
            <th className="px-4 py-2 border">상태</th>
          </tr>
        </thead>
        <tbody>
          {friends.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4">친구가 없습니다.</td>
            </tr>
          ) : (
            friends.filter(friend => friend.status != "DELETED").map(friend => (
              <tr key={friend.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{friend.name}</td>
                <td className="border px-4 py-2">{friend.email}</td>
                <td className="border px-4 py-2">
                  {friend.status === 'ACCEPTED' && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteFriend(friend.id)}
                    >
                      친구 삭제
                    </button>
                  )}

                  {friend.status === 'PENDING' && friend.sentByMe && (
                    <span className="text-gray-500">수락 대기중</span>
                  )}

                  {friend.status === 'PENDING' && !friend.sentByMe && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleAccept(friend.id)}
                    >
                      수락하기
                    </button>
                  )}

                  {friend.status === 'DECLINED' && (
                    <span className="text-red-400">거절됨</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FriendList;
