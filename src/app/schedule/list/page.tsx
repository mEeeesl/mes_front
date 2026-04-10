/** 바닐라 리액트 Home.jsx */

'use client'; // 클라이언트 컴포넌트로 지정
/*
Next.js App Router는 기본이 서버 컴포넌트. 
'use client'; 클라이언트 컴포넌트로 선언 - useEffect나 useState, Zustand 사용을 위함
*/

import CheckIn from "./_components/CheckIn";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@radix-ui/react-icons';




export default function ScheduleListPage() {
    // 실제로는 API로 받아올 데이터 (Mock)
    const mockSchedules = [
        { id: 1, title: '오전 일일 스크럼', time: '09:00 - 09:30', type: '미팅', color: 'bg-blue-500' },
        { id: 2, title: '운영 시스템 로그 점검', time: '10:30 - 11:30', type: '업무', color: 'bg-emerald-500' },
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20">
            {/* 헤더 섹션 */}
            <div className="flex justify-between items-end mb-8 px-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter mb-2">오늘의 일정</h2>
                    <p className="text-sm text-gray-400 font-medium">2026년 3월 18일 수요일, 업무 현황입니다.</p>
                </div>
                <button className="hidden md:flex items-center gap-1 text-sm font-bold text-[#488ad8] hover:underline">
                    전체 보기 <ArrowRightIcon />
                </button>
            </div>

            {/* 그리드 레이아웃 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. 메인 일정 리스트 (2컬럼 차지) */}
                <div className="md:col-span-2 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-8 hover:shadow-[0_20px_50px_rgba(72,138,216,0.1)] transition-all">
                    <div className="space-y-6">
                        {mockSchedules.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-[#488ad8] transition-colors">{item.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-medium">
                                            <span className="flex items-center gap-1"><ClockIcon /> {item.time}</span>
                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] uppercase">{item.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                    <ArrowRightIcon className="text-[#488ad8]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. 출근 카드 컴포넌트 (1컬럼 차지) */}
                <CheckIn />
                
            </div>
        </section>
    );
}



/** 위치기반 출근 */
/*

const COMPANY = {
  lat: 36.6358,   // 회사 위도 (수정하세요)
  lng: 127.4913   // 회사 경도
};

export function CheckIn() {
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [distance, setDistance] = useState(null);

  const toRad = (deg) => deg * Math.PI / 180;

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const checkLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        const dist = getDistance(
          latitude,
          longitude,
          COMPANY.lat,
          COMPANY.lng
        );

        setDistance(dist);

        // 핵심 조건
        if (dist <= 300 && accuracy <= 100) {
          setCanCheckIn(true);
        } else {
          setCanCheckIn(false);
        }
      },
      (err) => {
        console.error(err);
        alert("위치 권한을 허용해주세요.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleCheckIn = async () => {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const res = await fetch("https://your-api.com/check-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <button onClick={checkLocation}>
        위치 확인
      </button>

      <p>거리: {distance ? distance.toFixed(2) + "m" : "-"}</p>

      <button
        onClick={handleCheckIn}
        disabled={!canCheckIn}
      >
        출근하기
      </button>
    </div>
  );
}
*/