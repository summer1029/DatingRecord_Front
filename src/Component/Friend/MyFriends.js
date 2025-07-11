import React, { useEffect, useState } from 'react'

export default function MyFriends() {
    const [friends, setFriends] = useState([])

    useEffect(() => {
        fetch('http://192.168.10.151:8080/friends', {
            method: 'GET',
            headers: {
                Authorization: localStorage.getItem('loginToken'),
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('친구 목록 로딩 실패');
                return res.json();
            })
            .then((data) => setFriends(data))
            .catch((err) => {
                console.error(err);
                alert('친구 목록을 불러오는 데 실패했습니다.');
            });
    }, []);

    const totalFriends = friends.filter(f => f.status !== 'DELETED').length;
    const acceptedFriends = friends.filter(f => f.status === 'ACCEPTED').length;
    const pendingFriends = friends.filter(f => f.status === 'PENDING').length;

    return (
        <div className='flex-col justify-center items-center'>
            <h2 className='text-center text-3xl mt-10'>내 친구</h2>
            <div className='flex justify-center items-center'>
                <div className='w-full m-3'>
                    <table className="min-w-full border border-gray-300 mt-4">
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
                                friends
                                    .filter(friend => friend.status !== 'DELETED')
                                    .map(friend => (
                                        <tr key={friend.id}>
                                            <td className="border px-4 py-2">{friend.name}</td>
                                            <td className="border px-4 py-2">{friend.email}</td>
                                            <td className="border px-4 py-2">{friend.status}</td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='flex justify-center items-center m-3 p-1 border rounded-lg bg-red-200'>
                <p>친구: {totalFriends}명</p>
                <p className='ml-5 mr-5'>수락 대기 중: {pendingFriends}명</p>
                <p>수락 완료: {acceptedFriends}명</p>
            </div>
        </div>
    )
}
