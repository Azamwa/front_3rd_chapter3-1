import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const events: Event[] = [
    {
      id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
      title: '이벤트 2',
      date: '2024-11-15',
      startTime: '14:00',
      endTime: '17:00',
      description: 'Learn to cook Italian dishes',
      location: 'Culinary Arts Studio',
      category: 'Education',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 45,
    },
    {
      id: '5e3d9b2c-17c2-4c8e-8c2b-0f0c0d1f9e56',
      title: 'Photography Walk',
      date: '2024-07-02',
      startTime: '08:00',
      endTime: '10:30',
      description: 'Explore urban landscapes through photography',
      location: 'Central Park',
      category: 'Hobby',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-06-18' },
      notificationTime: 30,
    },
    {
      id: 'd1f74a3a-8b5e-4fa9-904f-7e0a14e9b333',
      title: 'Language Exchange Meetup',
      date: '2024-07-03',
      startTime: '19:00',
      endTime: '21:00',
      description: 'Practice languages with native speakers',
      location: 'Community Center',
      category: 'Social',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-02-01' },
      notificationTime: 20,
    },
    {
      id: 'f5c1b8d4-6a4f-4a11-8234-2f3a1d5c9f98',
      title: 'Yoga Class',
      date: '2024-07-24',
      startTime: '06:00',
      endTime: '07:00',
      description: 'Morning Vinyasa yoga for flexibility',
      location: 'Green Hills Yoga Studio',
      category: 'Health',
      repeat: { type: 'daily', interval: 1, endDate: '2024-12-01' },
      notificationTime: 15,
    },
    {
      id: '9b7c8d5e-1f0e-4d8a-bf23-3e9a1c4e7a45',
      title: 'Book Club Meeting',
      date: '2024-11-25',
      startTime: '18:00',
      endTime: '19:30',
      description: 'Discuss the monthly book selection',
      location: 'Local Library',
      category: 'Literature',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    },
    {
      id: 'c9b3a6f2-2e4a-4c9f-8d32-4d8f1b3e6f78',
      title: 'Gardening Workshop',
      date: '2024-09-29',
      startTime: '11:25',
      endTime: '14:25',
      description: 'Learn the basics of sustainable gardening',
      location: 'Botanical Gardens',
      category: 'Education',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 90, // 1시간 30분 전에 알림
    },
    {
      id: '9b7c8d5e-1f0e-4d8a-bf23-3e9a1c4e7a45',
      title: '헿',
      date: '2024-10-01',
      startTime: '18:00',
      endTime: '19:25',
      description: '디스크립션',
      location: '디스트릭트9',
      category: '외계인침공영화',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 50,
    },
  ];
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const filteredEvents = getFilteredEvents(events, '이벤트 2', new Date(), 'month');
    expect(filteredEvents).toEqual([
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        title: '이벤트 2',
        date: '2024-11-15',
        startTime: '14:00',
        endTime: '17:00',
        description: 'Learn to cook Italian dishes',
        location: 'Culinary Arts Studio',
        category: 'Education',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 45,
      },
    ]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toEqual([
      {
        id: '5e3d9b2c-17c2-4c8e-8c2b-0f0c0d1f9e56',
        title: 'Photography Walk',
        date: '2024-07-02',
        startTime: '08:00',
        endTime: '10:30',
        description: 'Explore urban landscapes through photography',
        location: 'Central Park',
        category: 'Hobby',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-06-18' },
        notificationTime: 30,
      },
      {
        id: 'd1f74a3a-8b5e-4fa9-904f-7e0a14e9b333',
        title: 'Language Exchange Meetup',
        date: '2024-07-03',
        startTime: '19:00',
        endTime: '21:00',
        description: 'Practice languages with native speakers',
        location: 'Community Center',
        category: 'Social',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-02-01' },
        notificationTime: 20,
      },
    ]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toEqual([
      {
        id: '5e3d9b2c-17c2-4c8e-8c2b-0f0c0d1f9e56',
        title: 'Photography Walk',
        date: '2024-07-02',
        startTime: '08:00',
        endTime: '10:30',
        description: 'Explore urban landscapes through photography',
        location: 'Central Park',
        category: 'Hobby',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-06-18' },
        notificationTime: 30,
      },
      {
        id: 'd1f74a3a-8b5e-4fa9-904f-7e0a14e9b333',
        title: 'Language Exchange Meetup',
        date: '2024-07-03',
        startTime: '19:00',
        endTime: '21:00',
        description: 'Practice languages with native speakers',
        location: 'Community Center',
        category: 'Social',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-02-01' },
        notificationTime: 20,
      },
      {
        id: 'f5c1b8d4-6a4f-4a11-8234-2f3a1d5c9f98',
        title: 'Yoga Class',
        date: '2024-07-24',
        startTime: '06:00',
        endTime: '07:00',
        description: 'Morning Vinyasa yoga for flexibility',
        location: 'Green Hills Yoga Studio',
        category: 'Health',
        repeat: { type: 'daily', interval: 1, endDate: '2024-12-01' },
        notificationTime: 15,
      },
    ]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const filteredEvents = getFilteredEvents(events, '이벤트', new Date('2024-11-15'), 'month');
    expect(filteredEvents).toEqual([
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        title: '이벤트 2',
        date: '2024-11-15',
        startTime: '14:00',
        endTime: '17:00',
        description: 'Learn to cook Italian dishes',
        location: 'Culinary Arts Studio',
        category: 'Education',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 45,
      },
    ]);
  });

  it('검색어가 없을 때 해당하는 필터(주/월)의 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(events, '', new Date(), 'month');
    expect(filteredEvents).toEqual([
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        title: '이벤트 2',
        date: '2024-11-15',
        startTime: '14:00',
        endTime: '17:00',
        description: 'Learn to cook Italian dishes',
        location: 'Culinary Arts Studio',
        category: 'Education',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 45,
      },
      {
        id: '9b7c8d5e-1f0e-4d8a-bf23-3e9a1c4e7a45',
        title: 'Book Club Meeting',
        date: '2024-11-25',
        startTime: '18:00',
        endTime: '19:30',
        description: 'Discuss the monthly book selection',
        location: 'Local Library',
        category: 'Literature',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 60,
      },
    ]);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const filteredEvents1 = getFilteredEvents(
      events,
      'bOoK CLuB MEetIng',
      new Date('2024-11-25'),
      'week'
    );
    expect(filteredEvents1).toEqual([
      {
        id: '9b7c8d5e-1f0e-4d8a-bf23-3e9a1c4e7a45',
        title: 'Book Club Meeting',
        date: '2024-11-25',
        startTime: '18:00',
        endTime: '19:30',
        description: 'Discuss the monthly book selection',
        location: 'Local Library',
        category: 'Literature',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 60,
      },
    ]);

    const filteredEvents2 = getFilteredEvents(
      events,
      'book club MEETING',
      new Date('2024-11-25'),
      'week'
    );
    expect(filteredEvents2).toEqual([
      {
        id: '9b7c8d5e-1f0e-4d8a-bf23-3e9a1c4e7a45',
        title: 'Book Club Meeting',
        date: '2024-11-25',
        startTime: '18:00',
        endTime: '19:30',
        description: 'Discuss the monthly book selection',
        location: 'Local Library',
        category: 'Literature',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 60,
      },
    ]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const filteredEvents1 = getFilteredEvents(events, '', new Date('2024-09-30'), 'month');
    expect(filteredEvents1).toEqual([
      {
        id: 'c9b3a6f2-2e4a-4c9f-8d32-4d8f1b3e6f78',
        title: 'Gardening Workshop',
        date: '2024-09-29',
        startTime: '11:25',
        endTime: '14:25',
        description: 'Learn the basics of sustainable gardening',
        location: 'Botanical Gardens',
        category: 'Education',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 90, // 1시간 30분 전에 알림
      },
    ]);

    const filteredEvents2 = getFilteredEvents(events, '', new Date('2024-10-01'), 'month');
    expect(filteredEvents2).toEqual([
      {
        id: '9b7c8d5e-1f0e-4d8a-bf23-3e9a1c4e7a45',
        title: '헿',
        date: '2024-10-01',
        startTime: '18:00',
        endTime: '19:25',
        description: '디스크립션',
        location: '디스트릭트9',
        category: '외계인침공영화',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 50,
      },
    ]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const filteredEvents = getFilteredEvents([], '', new Date('2024-09-30'), 'month');
    expect(filteredEvents).toEqual([]);
  });
});
