import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    const daysInMonth = getDaysInMonth(2024, 1);
    expect(daysInMonth).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    const daysInMonth = getDaysInMonth(2024, 4);
    expect(daysInMonth).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    const daysInMonth = getDaysInMonth(2024, 2);
    expect(daysInMonth).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    const daysInMonth = getDaysInMonth(2023, 2);
    expect(daysInMonth).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다(이전 해나 다음해의 일수를 반환한다)', () => {
    const daysInMonthArray = [
      getDaysInMonth(2023, 0),
      getDaysInMonth(2023, -1),
      getDaysInMonth(2023, 13),
      getDaysInMonth(2023, 15),
    ];

    expect(daysInMonthArray).toEqual([31, 30, 31, 31]);
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const weekDates = getWeekDates(new Date('2024-11-06'));
    expect(weekDates).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const weekDates = getWeekDates(new Date('2024-11-03'));
    expect(weekDates).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const weekDates = getWeekDates(new Date('2024-11-09'));
    expect(weekDates).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const weekDates = getWeekDates(new Date('2024-12-31'));
    expect(weekDates).toEqual([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const weekDates = getWeekDates(new Date('2025-01-01'));
    expect(weekDates).toEqual([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const weekDates = getWeekDates(new Date('2024-02-29'));
    expect(weekDates).toEqual([
      new Date('2024-02-25'),
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'),
      new Date('2024-03-01'),
      new Date('2024-03-02'),
    ]);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const weekDates = getWeekDates(new Date('2024-11-30'));
    expect(weekDates).toEqual([
      new Date('2024-11-24'),
      new Date('2024-11-25'),
      new Date('2024-11-26'),
      new Date('2024-11-27'),
      new Date('2024-11-28'),
      new Date('2024-11-29'),
      new Date('2024-11-30'),
    ]);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const weeksAtMonth = getWeeksAtMonth(new Date('2024-07-01'));
    expect(weeksAtMonth).toEqual([
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ]);
  });
});

describe('getEventsForDay', () => {
  const events: Event[] = [
    {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1,
    },
    {
      id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
      title: '점심 약속',
      date: '2024-12-31',
      startTime: '12:30',
      endTime: '13:30',
      description: '동료와 점심 식사',
      location: '회사 근처 식당',
      category: '개인',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1,
    },
  ];
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const eventsForDay = getEventsForDay(events, 1);
    expect(eventsForDay).toEqual([
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        title: '팀 회의',
        date: '2024-11-01',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1,
      },
    ]);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const eventsForDay = getEventsForDay(events, 22);
    expect(eventsForDay).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const eventsForDay = getEventsForDay(events, 0);
    expect(eventsForDay).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const eventsForDay = getEventsForDay(events, 32);
    expect(eventsForDay).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const weekInfo = formatWeek(new Date('2024-11-15'));
    expect(weekInfo).toBe('2024년 11월 2주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekInfo = formatWeek(new Date('2024-11-04'));
    expect(weekInfo).toBe('2024년 11월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekInfo = formatWeek(new Date('2024-11-30'));
    expect(weekInfo).toBe('2024년 11월 4주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekInfo = formatWeek(new Date('2025-01-01'));
    expect(weekInfo).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekInfo = formatWeek(new Date('2024-02-29'));
    expect(weekInfo).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekInfo = formatWeek(new Date('2025-02-28'));
    expect(weekInfo).toBe('2025년 2월 4주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    const monthInfo = formatMonth(new Date('2024-07-10'));
    expect(monthInfo).toBe('2024년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    const isWithinRange = isDateInRange(new Date('2024-07-10'), rangeStart, rangeEnd);
    expect(isWithinRange).toBe(true);
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    const isWithinRange = isDateInRange(new Date('2024-07-01'), rangeStart, rangeEnd);
    expect(isWithinRange).toBe(true);
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    const isWithinRange = isDateInRange(new Date('2024-07-31'), rangeStart, rangeEnd);
    expect(isWithinRange).toBe(true);
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    const isWithinRange = isDateInRange(new Date('2024-06-30'), rangeStart, rangeEnd);
    expect(isWithinRange).toBe(false);
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    const isWithinRange = isDateInRange(new Date('2024-08-01'), rangeStart, rangeEnd);
    expect(isWithinRange).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const isWithinRange = isDateInRange(new Date('2024-07-10'), rangeEnd, rangeStart);
    expect(isWithinRange).toBe(false);
  });
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    const fillZeroText = fillZero(5, 2);
    expect(fillZeroText).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    const fillZeroText = fillZero(10, 2);
    expect(fillZeroText).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    const fillZeroText = fillZero(3, 3);
    expect(fillZeroText).toBe('003');
  });

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {
    const fillZeroText = fillZero(100, 2);
    expect(fillZeroText).toBe('100');
  });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    const fillZeroText = fillZero(0, 2);
    expect(fillZeroText).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    const fillZeroText = fillZero(1, 5);
    expect(fillZeroText).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    const fillZeroText = fillZero(3.14, 5);
    expect(fillZeroText).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    const fillZeroText = fillZero(5);
    expect(fillZeroText).toBe('05');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    const fillZeroText = fillZero(1000, 2);
    expect(fillZeroText).toBe('1000');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    const formatDateText = formatDate(new Date('2024-11-04'));
    expect(formatDateText).toBe('2024-11-04');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    const formatDateText = formatDate(new Date('2024-11-04'), 20);
    expect(formatDateText).toBe('2024-11-20');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const formatDateText = formatDate(new Date('2024-8-04'));
    expect(formatDateText).toBe('2024-08-04');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const formatDateText = formatDate(new Date('2024-11-4'));
    expect(formatDateText).toBe('2024-11-04');
  });
});
