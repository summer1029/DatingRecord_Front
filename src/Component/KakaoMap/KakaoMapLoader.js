import React, { useEffect, useState } from 'react';

const KakaoMapLoader = ({ children }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            setLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=d74515eea7de540525a6c6909c79cca0&autoload=false&libraries=services';
        script.async = true;

        script.onload = () => {
            window.kakao.maps.load(() => {
                setLoaded(true); // ✅ maps가 준비된 이후에 children을 렌더
            });
        };

        document.head.appendChild(script);
    }, []);

    if (!loaded) return <div>Loading Kakao Maps...</div>;

    return <>{children}</>;
};

export default KakaoMapLoader;