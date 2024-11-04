import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const dateTime = parseDateTime('2024-07-01', '14:30');
    expect(dateTime).toEqual(new Date('2024-07-01T14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const dateTime = parseDateTime('2024/09/01', '14:30');
    expect(dateTime.toString()).toBe('Invalid Date');
    expect(dateTime).toEqual(new Date(''));
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const dateTime = parseDateTime('2024-09-01', '14-30');
    expect(dateTime.toString()).toBe('Invalid Date');
    expect(dateTime).toEqual(new Date(''));
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const dateTime = parseDateTime('', '14:30');
    expect(dateTime.toString()).toBe('Invalid Date');
    expect(dateTime).toEqual(new Date(''));
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const eventTime = convertEventToDateRange({
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
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
    });

    expect(eventTime).toEqual({
      start: new Date('2024-11-20T10:00'),
      end: new Date('2024-11-20T11:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const eventTime = convertEventToDateRange({
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024/11/20',
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
    });
    expect(eventTime.start.toString()).toBe('Invalid Date');
    expect(eventTime.end.toString()).toBe('Invalid Date');
    expect(eventTime).toEqual({
      start: new Date(''),
      end: new Date(''),
    });
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const eventTime = convertEventToDateRange({
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
      startTime: '10-00',
      endTime: '11-00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1,
    });
    expect(eventTime.start.toString()).toBe('Invalid Date');
    expect(eventTime.end.toString()).toBe('Invalid Date');
    expect(eventTime).toEqual({
      start: new Date(''),
      end: new Date(''),
    });
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
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
    };

    const event2: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
      startTime: '10:30',
      endTime: '12:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1,
    };
    const isOverlap = isOverlapping(event1, event2);
    expect(isOverlap).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
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
    };

    const event2: Event = {
      id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
      title: '팀 회의',
      date: '2024-11-20',
      startTime: '11:30',
      endTime: '12:30',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1,
    };
    const isOverlap = isOverlapping(event1, event2);
    expect(isOverlap).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const events: Event[] = [
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        title: '팀 회의',
        date: '2024-11-25',
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
        date: '2024-11-25',
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
      {
        id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
        title: '프로젝트 마감',
        date: '2024-11-26',
        startTime: '09:00',
        endTime: '18:00',
        description: '분기별 프로젝트 마감',
        location: '사무실',
        category: '업무',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1,
      },
      {
        id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
        title: '생일 파티',
        date: '2024-11-27',
        startTime: '19:00',
        endTime: '22:00',
        description: '친구 생일 축하',
        location: '친구 집',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1,
      },
      {
        id: '80d85368-b4a4-47b3-b959-25171d49371f',
        title: '운동',
        date: '2024-11-29',
        startTime: '18:00',
        endTime: '19:00',
        description: '주간 운동',
        location: '헬스장',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1,
      },
    ];

    const newEvent: Event = {
      id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
      title: '프로젝트 마감',
      date: '2024-11-25',
      startTime: '09:00',
      endTime: '15:00',
      description: '분기별 프로젝트 마감',
      location: '사무실',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1,
    };

    const getOverlapEvent = findOverlappingEvents(newEvent, events);
    expect(getOverlapEvent).toEqual([
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        title: '팀 회의',
        date: '2024-11-25',
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
        date: '2024-11-25',
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
    ]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const events: Event[] = [
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        title: '팀 회의',
        date: '2024-11-25',
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
        date: '2024-11-25',
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
      {
        id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
        title: '프로젝트 마감',
        date: '2024-11-26',
        startTime: '09:00',
        endTime: '18:00',
        description: '분기별 프로젝트 마감',
        location: '사무실',
        category: '업무',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1,
      },
      {
        id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
        title: '생일 파티',
        date: '2024-11-27',
        startTime: '19:00',
        endTime: '22:00',
        description: '친구 생일 축하',
        location: '친구 집',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1,
      },
      {
        id: '80d85368-b4a4-47b3-b959-25171d49371f',
        title: '운동',
        date: '2024-11-29',
        startTime: '18:00',
        endTime: '19:00',
        description: '주간 운동',
        location: '헬스장',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1,
      },
    ];

    const newEvent: Event = {
      id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
      title: '프로젝트 마감',
      date: '2024-11-25',
      startTime: '19:00',
      endTime: '22:00',
      description: '분기별 프로젝트 마감',
      location: '사무실',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 1,
    };

    const getOverlapEvent = findOverlappingEvents(newEvent, events);
    expect(getOverlapEvent).toEqual([]);
  });
});
