import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        padding: '20px',
        borderRadius: '8px',
        zIndex: 1000,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
};

const EventDetailModal = ({ isOpen, onClose, event, onUpdate, onDelete }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    useEffect(() => {
        if (event) {
            // console.log(start);
            // console.log(end);
            setTitle(event.title || '');
            setStart(event.start || '');  // YYYY-MM-DD 형태만 사용
            setEnd(event.end || '');
        }
    }, [event]);

    const handleUpdate = () => {
        if (!title || !start) {
            alert('제목과 시작일은 필수입니다.');
            return;
        }
        onUpdate({ ...event, title, start, end });
    };

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            onDelete(event.id);
        }
    };

    if (!event) return null;

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} style={customStyles}>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-3">일정 상세</h2>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">제목: </label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
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
                <input type="datetime-local" value={end ? end : start} onChange={e => setEnd(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 mb-3"
                />
            </div>
            <div className='flex justify-between'>
                <button onClick={handleUpdate}
                    className="w-1/3 text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 mr-3">
                    수정
                </button>
                <button onClick={handleDelete}
                    className="w-1/3 text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 mr-3">
                    삭제
                </button>
                <button onClick={onClose}
                    className="w-1/3 text-white bg-red-400 hover:bg-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 mr-3">
                    닫기
                </button>
            </div>

        </Modal>
    );
};

export default EventDetailModal;
