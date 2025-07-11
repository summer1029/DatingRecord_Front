import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000, // 가장 위에 표시
    width: '400px',
    padding: '20px',
    borderRadius: '8px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 어두운 배경
    zIndex: 999,
  },
};
const EventModal = ({ isOpen, onClose, onSubmit, defaultStartDate }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (defaultStartDate) {
      setStart(defaultStartDate);
    }
    if (defaultStartDate) {
      setEnd(defaultStartDate);
    }
  }, [defaultStartDate]);

  const handleSubmit = () => {
    if (!title || !start) {
      alert("제목과 시작일은 필수입니다.");
      return;
    }
    // const startDateTime = `${start}T00:00:00`;
    // const endDateTime = end ? `${end}T00:00:00` : null;
    console.log('입력된 일정 정보:', {
      title,
      start,
      end
    });

    onSubmit({
      title,
      start,
      end
    });  // 부모로 전달
    onClose(); // 닫기
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} style={customStyles}>
      <div id="datepicker-portal"></div>
      <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-3">일정 등록</h2>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-900">제목: </label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-3"
        />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-900">시작일: </label>
        <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-3"
        />
      </div>
      <div>
        <label className="block mb-2 text-md font-medium text-gray-900">종료일 (선택): </label>
        <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-3"
        />
      </div>
      <div className='flex justify-end'>
        <button onClick={handleSubmit}
          className="w-1/3 text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 mr-3">
          등록
        </button>
        <button onClick={onClose}
          className="w-1/3 text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3">
          취소
        </button>
      </div>
    </Modal>
  );
};

export default EventModal;
