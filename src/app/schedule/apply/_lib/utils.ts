/**
 * 근무 가능 날짜 목록 생성 로직
 * 1. 내일(익일)부터 신청 가능
 * 2. 금요일인 경우 월요일(혹은 다음 영업일)까지 오픈
 * 3. 공휴일/주말이 껴있으면 다음 첫 영업일까지 오픈
 */
export const getAvailableDates = (startDate: Date = new Date()): string[] => {
    const dates: string[] = [];
    const current = new Date(startDate);
    current.setDate(current.getDate() + 1); // 내일부터 시작

    // 공휴일 예시 (실제로는 API나 공휴일 리스트 필요)
    const holidays = ['2026-05-05', '2026-08-15']; 

    const isWorkDay = (date: Date) => {
        const day = date.getDay();
        const dateStr = date.toISOString().split('T')[0];
        return day !== 0 && day !== 6 && !holidays.includes(dateStr);
    };

    // 최소 익일은 무조건 포함
    dates.push(current.toISOString().split('T')[0]);

    // 익일이 영업일이 아니거나, 익일부터 다음 영업일까지의 구간을 구함
    const tempDate = new Date(current);
    while (true) {
        tempDate.setDate(tempDate.getDate() + 1);
        dates.push(tempDate.toISOString().split('T')[0]);
        
        // 영업일을 만났다면 거기서 멈춤 (그날까지는 오픈되어야 함)
        if (isWorkDay(tempDate)) break;
        
        // 무한루프 방지 (최대 10일치만 계산)
        if (dates.length > 10) break;
    }

    return dates;
};