import { useEffect } from 'react';

function MapMarker({ map, position, title, status, id, onUpdate, onDelete, onClose }) {
  useEffect(() => {
    if (!map) return;
    console.log(position)

    const markerImg = new window.kakao.maps.MarkerImage(
      status === 'VISITED'
        ? '/Img/visitedPin.svg'
        : '/Img/wishPin.png',
      new window.kakao.maps.Size(32, 32)
    );

    const marker = new window.kakao.maps.Marker({
      map: map,
      position: new window.kakao.maps.LatLng(position.lat, position.lng),
      title: title,
      image: markerImg
    });

    //추가 구현필요
    const iwContent = `
    <div style="padding:10px; font-size:14px; width:220px;">
      <div style="margin-bottom:6px;"><strong>장소 정보</strong></div>
  
      <div style="margin-bottom:6px;">
        <label>제목:</label><br/>
        <input type="text" id="location-title" value="${title}" style="width:100%; padding:4px;" />
      </div>
  
      ${status === 'VISITED'
        ? `
            <div style="margin-bottom:6px;">
              <span style="color:green;">📍 가본 곳</span>
            </div>
           
          `
        : `
            <div id="wish-container" style="margin-bottom:6px;">
              <input type="checkbox" id="wish" ${status === 'WISH' ? 'checked' : ''}/>
              <label for="wish">${status === 'WISH' ? '⭐ 가고 싶은 곳' : '상태 없음'}</label>
            </div>
            <div style="margin-bottom:6px;">
              <input type="checkbox" id="visited" />
              <label for="visited">📍 가본 곳</label>
            </div>
          
          `
      }

      <div class="flex justify-center items-center">
      <button
        onclick="handleUpdateLocation()"
        class="w-1/3 py-1.5 bg-blue-400 text-white rounded"
      >
        수정
      </button>
      <button
        onclick="handleDeleteLocation()"
        class="w-1/3 py-1.5 bg-slate-500 text-white rounded mr-2 ml-2"
      >
        삭제
      </button>
      <button
        class="w-1/3 py-1.5 bg-red-400 text-white rounded" id = "close-btn"
      >
        닫기
      </button>
    </div>
    </div>
  `;

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
    });
    window.kakao.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);

      const visitedCheckbox = document.getElementById('visited');
      const wishDiv = document.getElementById('wish-container');

      if (visitedCheckbox && wishDiv) {
        visitedCheckbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            // 가본 곳이 체크되면 wish 숨기기
            wishDiv.style.display = 'none';
          } else {
            // 체크 해제하면 다시 보이게
            wishDiv.style.display = 'block';
          }
        });
      }

      // 버튼이 infoWindow에 렌더링된 후에 이벤트 바인딩
      setTimeout(() => {
        const closeBtn = document.getElementById('close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            console.log("닫기 버튼 클릭됨");
            infoWindow.close();
          });
        }
      })

      // ✅ 체크 상태 동기화
      const wishCheckbox = document.getElementById('wish');
      if (wishCheckbox && wishDiv && status === 'VISITED') {
        wishDiv.style.display = 'none'; // VISITED일 때는 wish 숨김
      }
    });

    window.handleUpdateLocation = async () => {
      const newTitle = document.getElementById('location-title').value;
      const isVisited = document.getElementById('visited')?.checked;
      const newStatus = isVisited ? 'VISITED' : 'WISH';

      await onUpdate(id, newTitle, newStatus); // ← MyMap에서 내려온 콜백 호출

      infoWindow.close();
      marker.setMap(null);
    };
    window.handleDeleteLocation = async () => {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        await onDelete(id); // 🔥 props로 받은 삭제 콜백 호출
        infoWindow.close();
        marker.setMap(null);
      }
    };

    // 클린업
    return () => {
      infoWindow.close();
      marker.setMap(null);
    };

  }, [map, position, title, status, id]);

  return null;
}

export default MapMarker;
