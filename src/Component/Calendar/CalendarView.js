import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from './EventModal';
import { useEffect, useState } from 'react';
import EventDetailModal from './EventDetailModal';
import './Calendar.css';

function CalendarView() {
  const [events, setEvents] = useState();

  const [modalOpen, setModalOpen] = useState(false);     // ✅ 모달 열림 여부
  const [selectedDate, setSelectedDate] = useState('');  // ✅ 클릭된 날짜 기억

  const [detailModalOpen, setDetailModalOpen] = useState(false); // 상세 모달
  const [selectedEvent, setSelectedEvent] = useState(null);      // 상세 이벤트

  useEffect(() => {
    fetchEvents();
    // console.log(events);
  }, [])

  const currentYear = new Date().getFullYear();
  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://192.168.10.151:8080/events?startYear=${currentYear}&endYear=${currentYear}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM1NzE2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.bD8k5BC4htMcgVJAa62L_wMfqY8DSodiZCgLF_fEKHI", // 인증이 필요할 경우
        },
      });

      if (!res.ok) throw new Error('일정 불러오기 실패');

      const data = await res.json();
      // data는 [{ id, title, start, end }, ...] 형식이어야 함
      console.log(data);
      const visibleEvents = data.filter(ev => ev.isDelete === false);
      setEvents(visibleEvents);
    } catch (err) {
      console.error('❌ 일정 불러오기 오류:', err);
      alert('일정을 불러오는 중 오류가 발생했습니다.');
    }
  };


  // 날짜 클릭 정보 
  const handleDateClick = (arg) => {
    // const dDay = calculateDDay(arg.date);
    // alert(`${arg.dateStr} 까지 d‑day: ${dDay}일`);
    // console.log(arg);
    const now = new Date();

    const pad = (n) => n.toString().padStart(2, '0');
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());

    const formatted = `${arg.dateStr}T${hours}:${minutes}`;

    setSelectedDate(formatted);
    // setSelectedDate(arg);
    setModalOpen(true);
  };
  //일정 클릭 정보
  const handleEventClick = ({ event }) => {
    console.log(event);
    // console.log(event.title);
    // console.log(event.start);
    // console.log(event.endStr);

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: formatForDatetimeLocal(event.start),
      end: event.start === event.end ? null : formatForDatetimeLocal(event.end)
    });
    setDetailModalOpen(true);
  };
  //드랍후 정보
  const handleEventDrop = ({ event }) => {
    // console.log(event.EventImpl.start);
    const confirmMove = window.confirm("일정을 이동하시겠습니까?");

    if (!confirmMove) {
      event.revert(); // ❗ 취소하면 원래대로 되돌림
      return;
    }
    console.log('이벤트 제목:', event.title);
    console.log('새로운 시작 날짜:', event.start);    // Date 객체
    console.log('새로운 종료 날짜:', event.end);      // Date 객체 (없을 수도 있음)
    console.log('이벤트 ID:', event.id);               // id가 있으면
    console.log('이벤트 전체 객체:', event);

    handleUpdateEvent(event)

    // 이동 전 날짜
    // console.log('이전 시작 날짜:', oldEvent ? info.oldEvent.start : '없음'); // 예전 날짜

    // 이동 여부(취소 여부)
    // console.log('isCanceled:', revert); // revert() 호출하면 이동 취소됨
  };
  // 모달에서 일정 등록 → 이벤트 추가
  // const handleAddEvent = (data) => {
  //   setEvents([
  //     ...events,
  //     {
  //       title: data.title,
  //       start: data.start || selectedDate,
  //       end: data.end || null,
  //     },
  //   ]);
  // };
  const handleAddEvent = async (data) => {
    try {
      const res = await fetch('http://192.168.10.151:8080/add/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM1NzE2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.bD8k5BC4htMcgVJAa62L_wMfqY8DSodiZCgLF_fEKHI", // 필요 없다면 제거
        },
        body: JSON.stringify({
          title: data.title,
          startDate: data.start ? new Date(data.start).toISOString() : selectedDate,
          endDate: data.end ? new Date(data.end).toISOString() : null,
        }),
      });

      if (!res.ok) throw new Error('일정 등록 실패');
      setEvents([
        ...events,
        {
          title: data.title,
          start: data.start,
          end: data.end,
          color: '#f87171'
        },
      ]);
    } catch (err) {
      console.error('📛 일정 등록 실패:', err);
      alert('일정 등록 중 오류가 발생했습니다.');
    }
  };

  // 상세 모달에서 이벤트 수정
  const handleUpdateEvent = async (updatedEvent) => {
    try {
      console.log(updatedEvent);
      const eventId = updatedEvent.id;
      const res = await fetch(`http://192.168.10.151:8080/update/schedule/${eventId}`, {
        method: 'PUT', // 또는 PUT
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM1NzE2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.bD8k5BC4htMcgVJAa62L_wMfqY8DSodiZCgLF_fEKHI",
        },
        body: JSON.stringify({
          title: updatedEvent.title,
          startDate: updatedEvent.start,
          endDate: updatedEvent.end,
          // 필요 시
        }),
      });

      if (!res.ok) throw new Error('업데이트 실패');

      // const updated = await res.json(); // 응답으로 업데이트된 이벤트 받을 경우
      setEvents(fetchEvents());
      setDetailModalOpen(false);
      setSelectedEvent(null);
      alert('✅ 일정이 수정되었습니다!');
    } catch (err) {
      console.error('❌ 수정 중 오류 발생:', err);
      alert('일정 수정 실패');
    }
  };
  const handleDeleteEvent = async (eventId) => {
    try {
      const res = await fetch(`http://192.168.10.151:8080/delete/schedule/${eventId}`, {
        method: 'PUT',
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM1NzE2ODQsInVzZXJuYW1lIjoidGXjhYcyM0B0ZXN0LmNvbSJ9.bD8k5BC4htMcgVJAa62L_wMfqY8DSodiZCgLF_fEKHI", // 실제 토큰으로 교체
        },
      });

      if (!res.ok) throw new Error('삭제 실패');

      alert('✅ 일정이 삭제되었습니다!');
      // UI에서 제거
      setEvents(fetchEvents());
      setSelectedEvent(null);
      setDetailModalOpen(false);
    } catch (err) {
      console.error('❌ 삭제 중 오류 발생:', err);
      alert('일정 삭제 실패');
    }
  };

  const formatForDatetimeLocal = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}

      />
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddEvent}
        defaultStartDate={selectedDate}
      />
      <EventDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        event={selectedEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
}
export default CalendarView;