"use client"; // 클라이언트 컴포넌트 선언

import { CalendarIcon } from '@radix-ui/react-icons';
import { useCheckIn } from '@/hooks/schedule/useCheckIn'; // 훅 임포트

export default function CheckInCard() {
    //const { status, runCheckIn } = useCheckIn();
    // 훅에서 mutation 관련 상태들을 가져옵니다.
    const { handleCheckIn, isPending, isSuccess, distance } = useCheckIn();

    return (
                <div className="bg-[#488ad8] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-lg shadow-[#488ad8]/30">
            <div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight">
                    {status === 'success' ? "출근 완료!" : "아직 출근 전이신가요?"}
                </h3>
                {/* 거리 표시 영역 추가 */}
                <p className="text-white/70 text-sm leading-relaxed">
                    {distance && !isSuccess ? (
                        <span className="text-white font-bold bg-black/20 px-2 py-1 rounded-lg">
                             회사까지 {Math.floor(distance)}m 남음
                        </span>
                    ) : (
                        "버튼 한 번으로 간편하게 오늘의 출근여부를 등록하세요!"
                    )}
                </p>
                {/*
                <p className="text-white/70 text-sm leading-relaxed">
                    버튼 한 번으로 간편하게<br/>오늘의 출근여부를 등록하세요.
                </p>
                */}
            </div>
            
            <button 
                onClick={handleCheckIn}
                // 로딩 중이거나 이미 성공했다면 버튼을 비활성화합니다.
                disabled={isPending || isSuccess}
                className={`w-full py-4 font-black rounded-xl transition-all active:scale-95 mt-8 ${
                    (isPending || isSuccess)
                    ? "bg-white/50 text-white cursor-not-allowed" 
                    : "bg-white text-[#488ad8] hover:bg-gray-100"
                }`}
            >
                {/* 상태에 따른 텍스트 분기 처리 */}
                {isPending ? "위치 확인 중" : 
                 isSuccess ? "출근완료" : "출근하기"}
            </button>
        </div>
    );

/*
const COMPANY = { lat: 36.6358, lng: 127.4913 };

// 거리 계산 유틸 (파일 상단 혹은 외부 lib로 분리)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function CheckIn() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleCheckIn = () => {
        setStatus('loading');

        if (!navigator.geolocation) {
            alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
            setStatus('idle');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                const dist = getDistance(latitude, longitude, COMPANY.lat, COMPANY.lng);

                // 반경 300m 이내 조건
                if (dist <= 300) {
                    try {
                        // 서버 호출 (아까 수정한 경로 반영)
                        const res = await fetch("/checkIn/workProc", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ lat: latitude, lng: longitude, accuracy })
                        });

                        if (res.ok) {
                            alert("출근 신청이 완료되었습니다!");
                            setStatus('success');
                        } else {
                            alert("서버 오류가 발생했습니다.");
                            setStatus('idle');
                        }
                    } catch (err) {
                        alert("네트워크 연결을 확인해주세요.");
                        setStatus('idle');
                    }
                } else {
                    alert(`회사와 너무 멉니다. (현재 거리: ${Math.round(dist)}m)`);
                    setStatus('idle');
                }
            },
            (err) => {
                alert("위치 권한을 허용해야 출근 신청이 가능합니다.");
                setStatus('idle');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };
*/
    


        
        {/* AS-IS
        <div className="bg-[#488ad8] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-lg shadow-[#488ad8]/30">
            <div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight">
                    {status === 'success' ? "오늘 출근 완료!" : "아직 출근 전이신가요?"}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                    버튼 한 번으로 간편하게<br/>오늘의 출근여부를 등록하세요.
                </p>
            </div>
            
            <button 
                onClick={handleCheckIn}
                disabled={status !== 'idle'}
                className={`w-full py-4 font-black rounded-xl transition-all active:scale-95 mt-8 ${
                    status !== 'idle' 
                    ? "bg-white/50 text-white cursor-not-allowed" 
                    : "bg-white text-[#488ad8] hover:bg-gray-100"
                }`}
            >
                {status === 'loading' ? "위치 확인 중" : 
                 status === 'success' ? "출근완료" : "출근"}
            </button>
        </div>
    );
    */}
}