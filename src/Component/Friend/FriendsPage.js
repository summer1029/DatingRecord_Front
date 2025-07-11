import React, { useEffect, useState } from 'react';
import FriendList from './FriendList';

function FriendsPage({friends, setFriends}) {
  // const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://192.168.10.151:8080/friends', {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('loginToken'),
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('친구 목록을 불러오는 데 실패했습니다.');
        return res.json();
      })
      .then(data => {
        console.log(data);
        setFriends(data); // 부모 상태 업데이트 
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">에러: {error}</div>;

  return (
    <div className="w-full p-2 overflow-auto h-full">
      <FriendList friends={friends} setFriends={setFriends} />
    </div>
  );
}

export default FriendsPage;
