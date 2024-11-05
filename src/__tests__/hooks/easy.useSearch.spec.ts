import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

describe('useSearch', () => {
  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
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
    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

    expect(result.current.filteredEvents).toEqual(events);
  });

  it('검색어에 제목, 설명, 위치에 맞는 이벤트만 필터링 해야 한다.', () => {
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
    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

    act(() => result.current.setSearchTerm('Cooking Workshop'));

    expect(result.current.filteredEvents).toEqual([
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
    ]);
    act(() => result.current.setSearchTerm('landscapes through'));

    expect(result.current.filteredEvents).toEqual([
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
    ]);

    act(() => result.current.setSearchTerm('Hills'));

    expect(result.current.filteredEvents).toEqual([
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
    ]);
  });

  it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
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
        date: '2024-11-06',
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
        date: '2024-11-07',
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

    let view: 'week' | 'month' = 'week';
    const { result } = renderHook(
      ({ view }: { view: 'week' | 'month' }) => useSearch(events, new Date(), view),
      { initialProps: { view } }
    );

    expect(result.current.filteredEvents).toEqual([
      {
        id: '5e3d9b2c-17c2-4c8e-8c2b-0f0c0d1f9e56',
        title: 'Photography Walk',
        date: '2024-11-06',
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
        date: '2024-11-07',
        startTime: '19:00',
        endTime: '21:00',
        description: 'Practice languages with native speakers',
        location: 'Community Center',
        category: 'Social',
        repeat: { type: 'weekly', interval: 1, endDate: '2025-02-01' },
        notificationTime: 20,
      },
    ]);

    view = 'month';

    expect(result.current.filteredEvents).toEqual([
      {
        id: '5e3d9b2c-17c2-4c8e-8c2b-0f0c0d1f9e56',
        title: 'Photography Walk',
        date: '2024-11-06',
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
        date: '2024-11-07',
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

  it("검색어를 'Yoga'에서 'Photography'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
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
        date: '2024-11-06',
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
        date: '2024-11-07',
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

    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

    act(() => result.current.setSearchTerm('Yoga'));

    expect(result.current.filteredEvents).toEqual([
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
    ]);

    act(() => result.current.setSearchTerm('Photography'));

    expect(result.current.filteredEvents).toEqual([
      {
        id: '5e3d9b2c-17c2-4c8e-8c2b-0f0c0d1f9e56',
        title: 'Photography Walk',
        date: '2024-11-06',
        startTime: '08:00',
        endTime: '10:30',
        description: 'Explore urban landscapes through photography',
        location: 'Central Park',
        category: 'Hobby',
        repeat: { type: 'monthly', interval: 1, endDate: '2025-06-18' },
        notificationTime: 30,
      },
    ]);
  });
});
