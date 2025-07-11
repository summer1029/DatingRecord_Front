import React, { useEffect, useRef, useState } from 'react';
import MapMarker from './MapMarker';

const MyMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const clickMarkerRef = useRef(null); // 마커 상태를 ref로 관리
  const infoWindowRef = useRef(null);
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async () => {
    try {
      const res = await fetch('http://192.168.10.151:8080/places', {
        method: 'GET',
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM1NzE2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.bD8k5BC4htMcgVJAa62L_wMfqY8DSodiZCgLF_fEKHI", // 혹은 직접 토큰 삽입
        }
      });

      if (!res.ok) throw new Error('장소 불러오기 실패');
      const data = await res.json();
      console.log(data);
      setPlaces(data);
      return data;
    } catch (err) {
      console.error('장소 불러오기 에러:', err);
    }
  };

  // 👇 먼저 전역에 등록할 저장 핸들러
  window.handleSaveLocation = () => {
    const title = document.getElementById('location-title').value;
    const isVisited = document.getElementById('visited').checked;
    const isWishlist = document.getElementById('wishlist').checked;

    console.log('📍 저장할 장소:', {
      title,
      visited: isVisited,
      wishlist: isWishlist,
    });
    alert('📌 장소가 저장되었습니다!');
    if (window.infoWindowRef) {
      window.infoWindowRef.close();
    }
  };

  useEffect(() => {
    window.kakao.maps.load(async () => {
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
      };

      const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
      setMap(kakaoMap);
      await fetchPlaces();

      // 지도 클릭 시 새 장소 등록용 마커 + InfoWindow 띄우기
      window.kakao.maps.event.addListener(kakaoMap, 'click', function (mouseEvent) {

        // 기존 InfoWindow 닫기
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        // 기존 마커 제거
        if (clickMarkerRef.current) {
          clickMarkerRef.current.setMap(null);
        }

        const latlng = mouseEvent.latLng;

        // 새 마커
        const marker = new window.kakao.maps.Marker({
          position: latlng,
          map: kakaoMap,
        });
        clickMarkerRef.current = marker;

        const iwContent = `
          <div class="p-2 text-sm w-[225px]">
            <div class="mb-1.5 font-bold">새 장소 등록</div>
            <input
              type="text"
              id="location-title"
              placeholder="장소 이름"
              class="w-full p-1 text-sm border rounded mb-2"
            />
            <div class="mt-1.5 mb-2">
              <input type="checkbox" id="wishlist" class="mr-1" />
              <label for="wishlist" class="mr-2">⭐ 가고 싶은 곳</label>
              <input type="checkbox" id="visited" class="mr-1" />
              <label for="visited">📍 가본 곳</label>
            </div>
            <div class="flex justify-end items-center">
              <button
                onclick="handleSaveLocation()"
                class="w-1/2 py-1.5 bg-red-400 text-white rounded mr-2"
              >
                저장
              </button>
              <button
                onclick="handleCloseInfoWindow()"
                class="w-1/2 py-1.5 bg-red-400 text-white rounded"
              >
                닫기
              </button>
            </div>
          </div>
          `;

        const iw = new window.kakao.maps.InfoWindow({
          content: iwContent,
          position: latlng,
        });

        iw.open(kakaoMap, marker);
        infoWindowRef.current = iw;
        window.infoWindowRef = iw;

        // 저장 핸들러
        window.handleSaveLocation = async () => {
          const title = document.getElementById('location-title').value;
          const isVisited = document.getElementById('visited').checked;
          const isWishlist = document.getElementById('wishlist').checked;

          if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
          }

          const status = isVisited ? 'VISITED' : isWishlist ? 'WISH' : null;

          if (!status) {
            alert('상태를 선택해주세요.');
            return;
          }

          try {
            const res = await fetch('http://192.168.10.151:8080/add/place', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM1NzE2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.bD8k5BC4htMcgVJAa62L_wMfqY8DSodiZCgLF_fEKHI",
              },
              body: JSON.stringify({
                name: title,
                lat: latlng.getLat(),
                lng: latlng.getLng(),
                status: status,
              }),
            });

            if (!res.ok) throw new Error('등록 실패');

            alert('✅ 장소가 등록되었습니다!');
            iw.close();
            marker.setMap(null);
            clickMarkerRef.current = null;

            await fetchPlaces(); // 리스트 갱신
          } catch (err) {
            console.error('❌ 저장 오류:', err);
            alert('장소 저장 중 오류 발생');
          }
        };

        // 닫기 핸들러
        window.handleCloseInfoWindow = () => {
          iw.close();
          marker.setMap(null);
          clickMarkerRef.current = null;
        };
      });
    });
  }, []);

  const handleSearch = () => {
    const keyword = document.getElementById('search-input').value;
    if (!keyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, function (data, status, pagination) {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();

        data.forEach(place => {
          const latlng = new window.kakao.maps.LatLng(place.y, place.x);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: latlng,
          });

          bounds.extend(latlng);
        });

        map.setBounds(bounds);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  const handleUpdateLocation = async (id, newTitle, newStatus) => {
    try {
      const res = await fetch(`http://192.168.10.151:8080/place/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTMwNjc2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.o9-petQ68Xy-nisy1_b_MzxFl9bKXvVT0mkazbjN-TQ",
        },
        body: JSON.stringify({
          visitedNm: newTitle,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error('수정 실패');
      const updated = await fetchPlaces();
      setPlaces(updated);
      // const updated = await fetchPlaces();  // fetchPlaces()가 setPlaces 호출
      console.log('🔁 업데이트 후:', updated);
      alert('✅ 장소 정보가 수정되었습니다!');
    } catch (err) {
      console.error('❌ 업데이트 실패:', err);
      alert('수정 중 오류 발생');
    }
  };
  
  const handleDeleteLocation = async (id) => {
    try {
      const res = await fetch(`http://192.168.10.151:8080/place/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTMwNjc2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.o9-petQ68Xy-nisy1_b_MzxFl9bKXvVT0mkazbjN-TQ",
        },
      });
      if (!res.ok) throw new Error('삭제 실패');
      const updated = await fetchPlaces(); // 삭제 후 목록 갱신
      setPlaces(updated);
      alert('🗑️ 장소가 삭제되었습니다!');
    } catch (err) {
      console.error('❌ 삭제 오류:', err);
      alert('삭제 중 오류 발생');
    }
  };

  return (
    <>
      <div className='flex justify-between items-center'>
        <input
          type="text"
          id="search-input"
          placeholder="장소를 검색하세요"
          className='w-3/5 p-2 m-3'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          onClick={() => handleSearch()}
          className='p-2 m-3'
        >
          검색
        </button>
      </div>
      <div ref={mapRef} id="map" style={{ width: '100%', height: '400px' }} />
      {map && places.map((place, idx) => (
        <MapMarker
          key={place.id}
          map={map}
          position={{ lat: place.lat, lng: place.lng }}
          title={place.visitedNm}
          status={place.status}
          id={place.id}
          onUpdate={handleUpdateLocation}
          onDelete={handleDeleteLocation}
        />
      ))}
    </>
  );
};

export default MyMap;
