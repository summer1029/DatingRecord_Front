import React, { useState } from 'react'

export default function Search() {
  const [searchedValue, setSearchedValue] = useState('')
  const [searchedList, setSearchedList] = useState([])
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchedValue = (e) => {
    // 검색어 입력 즉시 검색 실행
    const value = e.currentTarget.value
    setSearchedValue(value)

    if (value.trim() !== '') {
      handleSearch(value) // 자동검색
    } else {
      setSearchedList([]) // 입력 없으면 결과 초기화
    }
  }

  const handleSearch = (keyword) => {
    if (!keyword) return setSearchedList([])

    // 입력된 문자열이 이메일인지 확인한는 함수
    const isEmail = /\S+@\S+\.\S+/.test(keyword)
    // 쿼리 파람 분리
    const queryParam = isEmail ? `email=${keyword}` : `name=${keyword}`
    console.log(queryParam)

    fetch(`http://192.168.10.151:8080/list?${queryParam}`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('loginToken'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('검색 결과:', data);
        setSearchedList(data)
      })
      .catch((err) => console.error('검색 실패:', err));
  };

  const handleAddFriend = (friendId) => {
    console.log("요청 보낼 friendId:", friendId)

    fetch(`http://192.168.10.151:8080/invite/${friendId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('loginToken'),
      },
      body: JSON.stringify({}), // 또는 생략해도 OK
    })
      .then(res => {
        const contentType = res.headers.get('content-type');
        console.log('Content-Type:', contentType);
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError('서버 응답이 JSON이 아닙니다.');
        }
        return res.json();
      })
      .then(data => {
        console.log('서버 응답:', data);
        alert('친구 추가 성공: ' + data.message);
      })
      .catch(err => {
        console.error('친구 추가 실패:', err);
        alert('친구 추가 실패: ' + err.message);
      });
  };

  return (
    <div className='flex justify-center items-center relative w-full gap-2'>
      <input type="search" id="default-search" className="flex-1 h-8 pl-2 text-sm border border-gray-300 rounded-lg"
        placeholder="친구를 검색하세요" value={searchedValue} onChange={handleSearchedValue} required
        onFocus={() => { setIsFocused(true) }} />
      {/* onBlur={() => setTimeout(() => setIsFocused(false), 150)}/> */}
      <button type="button" className="flex items-center justify-center text-sm text-white bg-red-400 rounded-lg hover:bg-red-300 h-8 px-4"
        onClick={() => handleSearch(searchedValue)}>
        검색
      </button>

      {/* {Array.isArray(searchedList) && searchedList.map((item) => (
            <div key={item.id} className="mb-1 text-gray-800">
                {item.nm} / {item.userEmail}
            </div>
          ))} */}

      {/* <div className="w-1/4 mt-3 overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                이름
              </th>
              <th scope="col" className="px-6 py-3">
                아이디
              </th>
              <th scope="col" className="px-6 py-3">
                친구 여부
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(searchedList) && searchedList.map((item) => (
              <tr className="bg-white border-b border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.nm}
                </th>
                <td className="px-6 py-4">
                  {item.userEmail}
                </td>
                // <td className="px-6 py-4">
                  // {item.friend ? '친구' : <button onClick={() => handleAddFriend(item.addresseeId)}>친구요청</button>}
                // </td>
                <td className="px-6 py-4">
                  {item.friendshipStatus === 'ACCEPT' ? (
                    <span className="text-green-600 font-semibold">이미 친구</span>
                  ) : item.friendshipStatus === 'PENDING' ? (
                    <span className="text-yellow-500 font-medium">수락 대기중</span>
                  ) : item.status === 'DELETE' ? (
                    <button
                      //   onClick={() => handleResendFriendRequest(item.addresseeId)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      친구 재요청
                    </button>
                  ) :
                    (
                      <button
                        onClick={() => handleAddFriend(item.addresseeId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        친구요청
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {isFocused && searchedList.length > 0 && (
        <ul className="absolute z-10 top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchedList.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div>
                <div className="font-semibold">{item.nm}</div>
                <div className="text-xs text-gray-500">{item.userEmail}</div>
              </div>
              <div>
                {console.log('addresseeId:', item.addresseeId)}

                {item.friendshipStatus === 'ACCEPT' ? (
                  <span className="text-green-600 text-sm">이미 친구</span>
                ) : item.friendshipStatus === 'PENDING' ? (
                  <span className="text-yellow-500 text-sm">수락 대기중</span>
                ) : item.status === 'DELETE' ? (
                  <button className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    친구 재요청
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                    onMouseDown={(e) => {
                      e.preventDefault(); // 포커스 이동 방지
                      console.log('handleAddFriend 호출, friendId:', item.addresseeId);
                      handleAddFriend(item.addresseeId);
                    }}
                  >
                    친구요청
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}
