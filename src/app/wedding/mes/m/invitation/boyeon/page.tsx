"use client";

import React, { useState, useEffect, useRef } from "react";

// --- [공통 스타일 정의] ---
const styles = {
  section: "py-20 px-6 md:px-10 bg-[#FAF9F6]", // 고급스러운 아이보리톤 배경
  sectionTitle: "text-[11px] tracking-[0.4em] text-stone-400 uppercase font-light text-center mb-12",
  serifHeading: "font-serif text-2xl md:text-3xl text-[#2C2A29] font-light leading-snug text-center",
  bodyText: "text-sm md:text-base text-stone-600 font-light leading-relaxed text-center",
  card: "bg-white p-6 rounded-xl shadow-sm border border-stone-100/80",
  tabBtnActive: "flex-1 py-3 text-sm font-normal text-stone-800 border-b-2 border-stone-800 transition-all",
  tabBtnInactive: "flex-1 py-3 text-sm font-light text-stone-400 border-b border-stone-100 transition-all hover:text-stone-600",
};

// --- [1. 스크롤 반응형 애니메이션 컴포넌트] ---
const ScrollReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 transform ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {children}
    </div>
  );
};

// --- [2. 시네마틱 인트로 컴포넌트] ---
const CinematicIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),  // 한글 문구
      setTimeout(() => setStage(2), 2000), // 영문 문구
      setTimeout(() => {
        setStage(3); // 페이드아웃 시작
        setTimeout(onComplete, 1000); // 본 화면 시작
      }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-center items-center bg-white transition-opacity duration-1000 ease-in-out ${stage === 3 ? "opacity-0" : "opacity-100"}`}>
      {/* 시네마틱 시크릿 상하단 바 */}
      <div className="absolute top-0 left-0 w-full h-[15%] bg-black transition-transform duration-1000 transform origin-top" />
      <div className="absolute bottom-0 left-0 w-full h-[15%] bg-black transition-transform duration-1000 transform origin-bottom" />

      <div className="relative z-10 text-center px-6 space-y-6">
        <h1 className={`font-serif text-2xl md:text-3xl font-light tracking-widest text-stone-900 transition-all duration-1000 transform ${stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          박보연 <span className="font-sans text-sm mx-1 text-stone-400">&</span> 홍길동
          <span className="text-lg md:text-xl mt-3 block font-sans font-light text-stone-600">
            결혼식에 초대합니다.
          </span>
        </h1>
        <p className={`text-xs md:text-sm font-extralight tracking-[0.3em] text-stone-400 uppercase transition-all duration-1000 transform ${stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          The Wedding Invitation
        </p>
      </div>
    </div>
  );
};

// --- [3. 메인 화보 커버 컴포넌트] ---
const MainCover: React.FC = () => {
  return (
    <div className="relative h-screen bg-stone-100 flex flex-col justify-between items-center py-20 text-center overflow-hidden">
      {/* 백그라운드 무드 이미지 */}
      <img
        src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop"
        alt="Wedding mood"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/90" />

      <div className="relative z-10 space-y-1">
        <span className="text-[10px] tracking-[0.4em] text-stone-500 uppercase font-light">The Wedding Day</span>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-light tracking-wide pt-2">홍길동 · 박보연</h2>
      </div>

      <div className="relative z-10 space-y-2">
        <p className="font-serif text-lg tracking-wider text-stone-800">2027. 01. 23. SAT. 12:30 PM</p>
        <p className="text-xs text-stone-500 tracking-widest font-light">아펠가모 선릉 단독홀</p>
      </div>
    </div>
  );
};

// --- [4. 감성 초대글 컴포넌트] ---
const InvitationText: React.FC = () => {
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Invitation</p>
      <div className="max-w-md mx-auto space-y-8">
        <h3 className={styles.serifHeading}>두 사람이 하나가 되는 날</h3>
        <p className={styles.bodyText}>
          서로 다른 길을 걸어온 저희 두 사람이<br />
          믿음과 사랑으로 한 곳을 바라보며<br />
          평생을 함께 걷기로 약속하려 합니다.<br />
          <br />
          귀한 걸음으로 오셔서 두 사람의 기쁜 시작을<br />
          따뜻한 사랑으로 가득 축복해주시면<br />
          더없는 큰 기쁨과 격려가 되겠습니다.
        </p>
      </div>
    </div>
  );
};

// --- [5. 달력 및 디데이 카운트다운 컴포넌트] ---
const CalendarAndDday: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date("2027-01-23T12:30:00+09:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.section} bg-white`}>
      <p className={styles.sectionTitle}>Calendar</p>
      <div className="max-w-xs mx-auto text-center space-y-8">
        <div className="space-y-1">
          <h4 className="font-serif text-lg text-stone-800">2027. 01. 23</h4>
          <p className="text-xs text-stone-400 tracking-wider">토요일 오후 12시 30분</p>
        </div>

        {/* 심플 수제 달력 */}
        <div className="grid grid-cols-7 gap-y-3 text-xs font-light text-stone-600">
          {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
            <div key={day} className={`font-normal ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : ""}`}>{day}</div>
          ))}
          {/* 공백칸 (2027년 1월 1일은 금요일) */}
          <div /><div /><div /><div />
          {Array.from({ length: 31 }, (_, i) => {
            const dateNum = i + 1;
            const isTarget = dateNum === 23;
            // 일요일 판별 (1월 1일 금(4), 토(5), 일(6)...)
            const isSunday = (dateNum + 4) % 7 === 0;
            const isSaturday = (dateNum + 4) % 7 === 6;

            return (
              <div key={dateNum} className="relative flex justify-center items-center h-8">
                {isTarget && (
                  <div className="absolute inset-0 m-auto w-7 h-7 bg-amber-800/10 border border-amber-800/40 rounded-full animate-pulse" />
                )}
                <span className={`${isTarget ? "text-amber-950 font-bold" : isSunday ? "text-red-400" : isSaturday ? "text-blue-400" : "text-stone-700"}`}>
                  {dateNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* 카운트다운 네모 박스 */}
        {isMounted && (
          <div className="space-y-4 pt-6">
            <div className="text-xs tracking-wider text-stone-400 font-light">두 사람의 예식이 남아있습니다.</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINS", value: timeLeft.minutes },
                { label: "SECS", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-[#FAF9F6] border border-stone-100 rounded-lg py-3 flex flex-col items-center">
                  <span className="text-lg font-serif font-light text-stone-800">{String(item.value).padStart(2, "0")}</span>
                  <span className="text-[9px] text-stone-400 tracking-wider mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- [5-2. 화보식 갤러리 및 모달 뷰어 컴포넌트] ---
const PremiumGallery: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // 고화질 웨딩 컨셉 플레이스홀더 이미지 (추후 실제 이미지 파일 경로로 교체 가능)
  const allImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
    
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",

    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=600&auto=format&fit=crop",
  ];

  // 접혀있을 때는 3개, 펼쳤을 때는 9개 전부 노출
  const visibleImages = expanded ? allImages : allImages.slice(0, 4);

  return (
    <div className={`${styles.section} bg-white pb-12`}>
      <p className={styles.sectionTitle}>Gallery</p>
      <div className="max-w-md mx-auto space-y-4">
        {/* 그리드 레이아웃: 기본 3개 상태일 때 비대칭 예술 레이아웃 적용 */}
        <div className="grid grid-cols-3 gap-2">
          {visibleImages.map((src, index) => {
            const isFeatured = !expanded && index === 0;
            return (
              <div
                key={index}
                onClick={() => setSelectedImg(src)}
                className={`relative cursor-pointer overflow-hidden rounded-xl bg-stone-100 group transition-all duration-300 active:scale-95 ${
                  isFeatured ? "col-span-3 aspect-[4/3]" : "col-span-1 aspect-square"
                }`}
              >
                <img
                  src={src}
                  alt={`Wedding Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        {/* 더보기 / 접기 버튼 */}
        <div className="text-center pt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-150 text-stone-500 text-xs tracking-widest uppercase rounded-full bg-[#FAF9F6] hover:bg-stone-50 transition-all font-light"
          >
            {expanded ? (
              <>
                접기
                <svg className="w-3 h-3 transform rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            ) : (
              <>
                더보기
                <svg className="w-3 h-3 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 이미지 전체화면 확대 팝업 모달 */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors" title="닫기">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImg}
            alt="Expanded Wedding Photo"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-[scale-up_0.25s_ease-out]"
          />
        </div>
      )}
    </div>
  );
};

// --- [6. 가족 관계 구성 & 연락하기 모달 컴포넌트] ---
interface Person {
  relation: string;
  name: string;
  phone: string;
}

const FamilyAndContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom");

  const groomSide: Person[] = [
    { relation: "신랑", name: "홍길동", phone: "010-1234-1234" },
    { relation: "신랑 아버지", name: "홍길박", phone: "010-1234-1234" },
    { relation: "신랑 어머니", name: "홍길순", phone: "010-1234-1234" },
  ];

  const brideSide: Person[] = [
    { relation: "신부", name: "박보연", phone: "010-1234-1234" },
    { relation: "신부 아버지", name: "박홍길", phone: "010-1234-1234" },
    { relation: "신부 어머니", name: "박홍순", phone: "010-1234-1234" },
  ];

  const currentList = activeTab === "groom" ? groomSide : brideSide;

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Family</p>
      <div className="max-w-xs mx-auto text-center space-y-10">
        {/* 가족 관계 표기식 */}
        <div className="space-y-6 text-stone-600 text-sm font-light leading-loose">
          <div className="flex flex-col items-center gap-1">
            <p>
              <span className="font-normal text-stone-800">홍길박 · 홍길순</span> 의 아들
            </p>
            <p className="font-serif text-lg text-stone-950 font-medium">길동</p>
          </div>
          <div className="w-8 h-px bg-stone-200 mx-auto" />
          <div className="flex flex-col items-center gap-1">
            <p>
              <span className="font-normal text-stone-800">박홍길 · 박홍순</span> 의 딸
            </p>
            <p className="font-serif text-lg text-stone-950 font-medium">보연</p>
          </div>
        </div>

        {/* 축하연락하기 버튼 */}
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2C2A29] text-white hover:bg-stone-800 text-xs tracking-widest uppercase px-8 py-4 rounded-full transition-all shadow-sm"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M21.386 6.085l-8.033 5.424c-.818.552-1.888.552-2.706 0l-8.033-5.424a1.002 1.002 0 011.116-1.664l8.033 5.424c.159.108.369.108.528 0l8.033-5.424a1 1 0 111.116 1.664z" />
            <path d="M22 7.585V17c0 1.654-1.346 3-3 3H5c-1.654 0-3-1.346-3-3V7.585l7.382 4.983c1.637 1.104 3.799 1.104 5.436 0L22 7.585z" />
          </svg>
          축하 연락하기
        </button>

        {/* 모달 창 */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-[fade-in_0.3s_ease]">
              {/* 모달 헤더 */}
              <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-[#FAF9F6]">
                <h4 className="text-sm tracking-wider text-stone-800 font-medium">축하 연락처 목록</h4>
                <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 탭 헤더 */}
              <div className="flex border-b border-stone-100 bg-white">
                <button
                  onClick={() => setActiveTab("groom")}
                  className={activeTab === "groom" ? styles.tabBtnActive : styles.tabBtnInactive}
                >
                  신랑측 연락처
                </button>
                <button
                  onClick={() => setActiveTab("bride")}
                  className={activeTab === "bride" ? styles.tabBtnActive : styles.tabBtnInactive}
                >
                  신부측 연락처
                </button>
              </div>

              {/* 탭 내용 */}
              <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                {currentList.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-xl border border-stone-100">
                    <div className="text-left space-y-0.5">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest">{person.relation}</span>
                      <p className="text-sm text-stone-800 font-medium">{person.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${person.phone}`}
                        className="p-2.5 bg-white rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                        title="전화 걸기"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                      <a
                        href={`sms:${person.phone}`}
                        className="p-2.5 bg-white rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                        title="문자 보내기"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- [7. 길 찾기 & 정밀 지도 & 주차장 정보 컴포넌트] ---
const MapAndTransit: React.FC = () => {
  return (
    <div className={`${styles.section} bg-white`}>
      <p className={styles.sectionTitle}>Location</p>
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-amber-800 tracking-widest font-normal uppercase">아펠가모 선릉 (한신인터밸리24빌딩)</span>
          <h4 className="font-serif text-xl text-stone-800 font-light">서울 강남구 테헤란로 322 한신인터밸리24 B1층</h4>
        </div>

        {/* 정밀 그래픽 위젯 지도 자리 */}
        <div className="relative aspect-video w-full rounded-2xl bg-[#FAF9F6] border border-stone-100 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
          <div className="relative z-10 text-center space-y-2">
            <span className="text-[11px] tracking-widest text-stone-400 font-light uppercase">Map & Location View</span>
            <p className="text-xs text-stone-500 font-light">선릉역 4번 출구 도보 3분 거리</p>
          </div>
        </div>

        {/* 지도 바로가기 버튼군 */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="https://map.kakao.com/link/to/아펠가모 선릉,37.5039474,127.0450519"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-[#FFEB00] text-[#3C1E1E] text-xs font-normal rounded-xl transition-all"
          >
            카카오맵 연결
          </a>
          <a
            href="https://map.naver.com/v5/entry/place/31201275"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-[#03C75A] text-white text-xs font-normal rounded-xl transition-all"
          >
            네이버지도 연결
          </a>
        </div>

        {/* 주차장 안내 카드 */}
        <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-100 space-y-4 text-xs font-light text-stone-600">
          <div className="flex gap-3 items-start">
            <span className="shrink-0 bg-stone-200 text-stone-700 text-[10px] font-normal px-2 py-0.5 rounded">자차 안내</span>
            <p className="leading-relaxed">
              <strong>당일 예식 하객 무료주차 2시간 제공</strong><br />
              한신인터밸리24 빌딩 지하 주차장 (총 500대 수용 가능)<br />
              출차 시 예식장에서 제공하는 무료 주차권을 수령해주세요.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="shrink-0 bg-stone-200 text-stone-700 text-[10px] font-normal px-2 py-0.5 rounded">지하철</span>
            <p className="leading-relaxed">
              <strong>2호선, 수인분당선 선릉역</strong> 4번 출구에서 도보 약 3분 거리에 위치하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- [8. 마음 전하실 곳 계좌 안내 컴포넌트] ---
interface Account {
  relation: string;
  name: string;
  bank: string;
  number: string;
}

const DirectGift: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom");

  const groomAccounts: Account[] = [
    { relation: "신랑", name: "홍길동", bank: "국민은행", number: "111111-01-111111" },
    { relation: "신랑 아버지", name: "홍길박", bank: "신한은행", number: "123-12-123456" },
    { relation: "신랑 어머니", name: "홍길순", bank: "우리은행", number: "1002-123-123456" },
  ];

  const brideAccounts: Account[] = [
    { relation: "신부", name: "박보연", bank: "카카오뱅크", number: "3333-11-1111111" },
    { relation: "신부 아버지", name: "박홍길", bank: "하나은행", number: "987-654321-12345" },
    { relation: "신부 어머니", name: "박홍순", bank: "농협은행", number: "302-1234-5678-90" },
  ];

  const activeAccounts = activeTab === "groom" ? groomAccounts : brideAccounts;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("계좌번호가 복사되었습니다.");
  };

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>Gift</p>
      <div className="max-w-md mx-auto space-y-8 text-center">
        <div className="space-y-2">
          <h4 className={styles.serifHeading}>축하의 마음 전하기</h4>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            참석이 어려우신 분들을 위해<br />
            마음 전하실 곳을 안내해 드립니다.
          </p>
        </div>

        {/* 탭 헤더 */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab("groom")}
            className={activeTab === "groom" ? styles.tabBtnActive : styles.tabBtnInactive}
          >
            신랑측 계좌번호
          </button>
          <button
            onClick={() => setActiveTab("bride")}
            className={activeTab === "bride" ? styles.tabBtnActive : styles.tabBtnInactive}
          >
            신부측 계좌번호
          </button>
        </div>

        {/* 계좌 정보 리스트 */}
        <div className="space-y-4">
          {activeAccounts.map((account, index) => (
            <div key={index} className="bg-white p-5 rounded-xl border border-stone-100 flex items-center justify-between shadow-sm">
              <div className="text-left space-y-1">
                <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 text-stone-500 rounded font-normal">{account.relation} {account.name}</span>
                <p className="text-sm font-medium text-stone-800">{account.bank}</p>
                <p className="text-xs text-stone-400 tracking-wider font-light">{account.number}</p>
              </div>
              <button
                onClick={() => handleCopy(account.number)}
                className="text-[11px] text-stone-600 bg-[#FAF9F6] border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50"
              >
                복사
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- [9. 주소 복사 및 링크 공유 컴포넌트] ---
const ShareAndCopy: React.FC = () => {
  const handleCopyLink = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://invitation-boyeon.wedding";
    navigator.clipboard.writeText(currentUrl);
    alert("청첩장 주소가 복사되었습니다.");
  };

  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://invitation-boyeon.wedding";

    // 모바일 네이티브 공유 API 지원 여부 확인
    if (navigator.share) {
      try {
        await navigator.share({
          title: "박보연 & 홍길동 결혼식 초대장",
          text: "우리 결혼합니다. 기쁜 날 함께하셔서 축복해주세요.",
          url: currentUrl,
        });
      } catch (err) {
        console.log("공유 중 취소 혹은 오류 발생:", err);
      }
    } else {
      // 데스크톱 혹은 브라우저 미지원 시 링크 복사 기능으로 대체 연동
      handleCopyLink();
    }
  };

  return (
    <div className={`${styles.section} bg-white pt-10 pb-16`}>
      <div className="max-w-xs mx-auto flex flex-col gap-3">
        <button
          onClick={handleCopyLink}
          className="w-full py-4 text-xs font-light text-stone-600 bg-[#FAF9F6] border border-stone-100 hover:bg-stone-150 rounded-xl transition-all tracking-widest uppercase"
        >
          청첩장 주소 복사하기
        </button>
        <button
          onClick={handleShare}
          className="w-full py-4 text-xs font-light text-white bg-[#2C2A29] hover:bg-stone-800 rounded-xl transition-all tracking-widest uppercase"
        >
          카카오톡으로 전하기
        </button>
      </div>
    </div>
  );
};

// --- [10. 이니셜 로고 푸터 컴포넌트] ---
const Footer: React.FC = () => {
  return (
    <div className="py-16 text-center space-y-4 bg-[#FAF9F6] border-t border-stone-100/60">
      <div className="font-serif italic text-sm tracking-[0.2em] text-stone-300 font-light select-none">
        WITH YM
      </div>
      <p className="text-[10px] text-stone-400 font-extralight tracking-wider">
        © 2027 Gildong & Boyeon. All rights reserved.
      </p>
    </div>
  );
};

// === [메인 모바일 결혼 초대장 최상위 페이지] ===
export default function WeddingInvitationPage() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative min-h-screen bg-neutral-100 text-stone-800 overflow-x-hidden select-none">
      
      {/* A. 시네마틱 매드무비 인트로 */}
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

      {/* B. 모바일 본 화면 레이어 */}
      <div className={`w-full max-w-md mx-auto bg-white min-h-screen shadow-2xl transition-opacity duration-1000 ease-in-out ${!showIntro ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <MainCover />
        
        <ScrollReveal>
          <InvitationText />
        </ScrollReveal>

        <ScrollReveal>
          <CalendarAndDday />
        </ScrollReveal>

        <ScrollReveal>
          <PremiumGallery />
        </ScrollReveal>

        <ScrollReveal>
          <FamilyAndContact />
        </ScrollReveal>

        <ScrollReveal>
          <MapAndTransit />
        </ScrollReveal>

        <ScrollReveal>
          <DirectGift />
        </ScrollReveal>

        <ScrollReveal>
          <ShareAndCopy />
        </ScrollReveal>

        <Footer />
      </div>

    </div>
  );
}