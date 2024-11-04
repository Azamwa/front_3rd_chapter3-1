import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const events: Event[] = [
    {
      id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
      title: 'Cooking Workshop',
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
      date: '2024-11-15',
      startTime: '14:10',
      endTime: '15:30',
      description: 'Explore urban landscapes through photography',
      location: 'Central Park',
      category: 'Hobby',
      repeat: { type: 'monthly', interval: 1, endDate: '2025-06-18' },
      notificationTime: 30,
    },
    {
      id: 'd1f74a3a-8b5e-4fa9-904f-7e0a14e9b333',
      title: 'Language Exchange Meetup',
      date: '2024-11-20',
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
      date: '2024-11-22',
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
  ];
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const upcommingEvents = getUpcomingEvents(events, new Date('2024-11-15T13:59'), []);
    expect(upcommingEvents).toEqual([
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        title: 'Cooking Workshop',
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
        date: '2024-11-15',
        startTime: '14:10',
        endTime: '15:30',
        description: 'Explore urban landscapes through photography',
        location: 'Central Park',
        category: 'Hobby',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-06-18' },
        notificationTime: 30,
      },
    ]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const upcommingEvents = getUpcomingEvents(events, new Date('2024-11-15T13:59'), [
      'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
    ]);
    expect(upcommingEvents).toEqual([
      {
        id: '5e3d9b2c-17c2-4c8e-8c2b-0f0c0d1f9e56',
        title: 'Photography Walk',
        date: '2024-11-15',
        startTime: '14:10',
        endTime: '15:30',
        description: 'Explore urban landscapes through photography',
        location: 'Central Park',
        category: 'Hobby',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-06-18' },
        notificationTime: 30,
      },
    ]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const upcommingEvents = getUpcomingEvents(events, new Date('2024-11-22T05:00'), []);
    expect(upcommingEvents).not.toEqual({
      id: 'f5c1b8d4-6a4f-4a11-8234-2f3a1d5c9f98',
      title: 'Yoga Class',
      date: '2024-11-22',
      startTime: '06:00',
      endTime: '07:00',
      description: 'Morning Vinyasa yoga for flexibility',
      location: 'Green Hills Yoga Studio',
      category: 'Health',
      repeat: { type: 'daily', interval: 1, endDate: '2024-12-01' },
      notificationTime: 15,
    });
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const upcommingEvents = getUpcomingEvents(events, new Date('2024-11-22T05:00'), []);
    expect(upcommingEvents).not.toEqual({
      id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
      title: 'Cooking Workshop',
      date: '2024-11-15',
      startTime: '14:00',
      endTime: '17:00',
      description: 'Learn to cook Italian dishes',
      location: 'Culinary Arts Studio',
      category: 'Education',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 45,
    });
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const notificationMessage = createNotificationMessage({
      id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
      title: 'Cooking Workshop',
      date: '2024-11-15',
      startTime: '14:00',
      endTime: '17:00',
      description: 'Learn to cook Italian dishes',
      location: 'Culinary Arts Studio',
      category: 'Education',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 45,
    });

    expect(notificationMessage).toBe('45분 후 Cooking Workshop 일정이 시작됩니다.');
  });
});
