import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';

describe('useNotification', () => {
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
      date: '2024-11-18',
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

  vi.useFakeTimers();

  it('초기 상태에서는 알림이 없어야 한다', () => {
    const { result } = renderHook(() => useNotifications(events));

    expect(result.current.notifications).toEqual([]);
  });

  it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
    const mockDateTime = new Date('2024-11-15T13:50');
    vi.setSystemTime(mockDateTime);

    const { result } = renderHook(() => useNotifications(events));

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.notifications).toEqual([
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        message: '45분 후 Cooking Workshop 일정이 시작됩니다.',
      },
    ]);
  });

  it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
    const mockDateTime = new Date('2024-11-15T13:50');
    vi.setSystemTime(mockDateTime);

    const { result } = renderHook(() => useNotifications(events));

    act(() => vi.advanceTimersByTime(1000));

    act(() => result.current.removeNotification(0));

    expect(result.current.notifications).toEqual([]);
  });

  it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
    const mockDateTime = new Date('2024-11-15T13:50');
    vi.setSystemTime(mockDateTime);

    const { result } = renderHook(() => useNotifications(events));

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.notifications).toEqual([
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        message: '45분 후 Cooking Workshop 일정이 시작됩니다.',
      },
    ]);

    act(() => vi.advanceTimersByTime(1000));

    expect(result.current.notifications).not.toEqual([
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        message: '45분 후 Cooking Workshop 일정이 시작됩니다.',
      },
      {
        id: 'a7f8d5e0-3f4b-4b8a-9e20-1f46a8c5e123',
        message: '45분 후 Cooking Workshop 일정이 시작됩니다.',
      },
    ]);
  });
});
