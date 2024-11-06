import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';

const toast = vi.fn();

vi.mock('@chakra-ui/react', () => {
  return {
    useToast: () => {
      return toast;
    },
  };
});

describe('일정들을 네트워크 요청 처리한다.', () => {
  it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
    const { result } = renderHook(() => useEventOperations(false));

    await waitFor(() => {
      expect(result.current.events).toEqual([
        {
          id: '1',
          title: '기존 회의',
          date: '2024-10-15',
          startTime: '09:00',
          endTime: '10:00',
          description: '기존 팀 미팅',
          location: '회의실 B',
          category: '업무',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ]);

      expect(toast).toHaveBeenCalledWith({
        duration: 1000,
        status: 'info',
        title: '일정 로딩 완료!',
      });
    });
  });

  it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
    const { result } = renderHook(() => useEventOperations(true));

    act(() => {
      result.current.saveEvent({
        id: '1',
        title: '변경회의',
        date: '2024-10-15',
        startTime: '09:00',
        endTime: '14:00',
        description: '변경 팀 미팅',
        location: '화장실 B',
        category: '용변',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });
    });

    await waitFor(() => {
      expect(result.current.events).toEqual([
        {
          id: '1',
          title: '변경회의',
          date: '2024-10-15',
          startTime: '09:00',
          endTime: '14:00',
          description: '변경 팀 미팅',
          location: '화장실 B',
          category: '용변',
          repeat: { type: 'none', interval: 0 },
          notificationTime: 10,
        },
      ]);

      expect(toast).toHaveBeenCalledWith({
        duration: 3000,
        isClosable: true,
        status: 'success',
        title: '일정이 수정되었습니다.',
      });
    });
  });

  it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
    const { result } = renderHook(() => useEventOperations(false));

    act(() => {
      result.current.saveEvent({
        id: '2',
        title: '추가 용변',
        date: '2024-10-14',
        startTime: '02:00',
        endTime: '04:00',
        description: '조그만한 용변',
        location: '화장실',
        category: '용변 업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });
    });

    await waitFor(() => {
      expect(result.current.events).toEqual([
        {
          category: '업무',
          date: '2024-10-15',
          description: '기존 팀 미팅',
          endTime: '10:00',
          id: '1',
          location: '회의실 B',
          notificationTime: 10,
          repeat: {
            interval: 0,
            type: 'none',
          },
          startTime: '09:00',
          title: '기존 회의',
        },
        {
          category: '용변 업무',
          date: '2024-10-14',
          description: '조그만한 용변',
          endTime: '04:00',
          id: '2',
          location: '화장실',
          notificationTime: 10,
          repeat: {
            interval: 0,
            type: 'none',
          },
          startTime: '02:00',
          title: '추가 용변',
        },
      ]);

      expect(toast).toHaveBeenCalledWith({
        duration: 3000,
        isClosable: true,
        status: 'success',
        title: '일정이 추가되었습니다.',
      });
    });
  });

  it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
    const { result } = renderHook(() => useEventOperations(false));

    act(() => {
      result.current.saveEvent({
        id: '2',
        title: '추가 용변',
        date: '2024-10-14',
        startTime: '02:00',
        endTime: '04:00',
        description: '조그만한 용변',
        location: '화장실',
        category: '용변 업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });
    });

    await waitFor(() => {
      expect(result.current.events).toEqual([
        {
          category: '업무',
          date: '2024-10-15',
          description: '기존 팀 미팅',
          endTime: '10:00',
          id: '1',
          location: '회의실 B',
          notificationTime: 10,
          repeat: {
            interval: 0,
            type: 'none',
          },
          startTime: '09:00',
          title: '기존 회의',
        },
        {
          category: '용변 업무',
          date: '2024-10-14',
          description: '조그만한 용변',
          endTime: '04:00',
          id: '2',
          location: '화장실',
          notificationTime: 10,
          repeat: {
            interval: 0,
            type: 'none',
          },
          startTime: '02:00',
          title: '추가 용변',
        },
      ]);
    });

    act(() => {
      result.current.deleteEvent('1');
    });

    await waitFor(() => {
      expect(result.current.events).toEqual([
        {
          category: '용변 업무',
          date: '2024-10-14',
          description: '조그만한 용변',
          endTime: '04:00',
          id: '2',
          location: '화장실',
          notificationTime: 10,
          repeat: {
            interval: 0,
            type: 'none',
          },
          startTime: '02:00',
          title: '추가 용변',
        },
      ]);
    });
  });

  it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
    server.use(
      http.get('*', () => {
        return HttpResponse.error();
      })
    );
    const { result } = renderHook(() => useEventOperations(false));

    await waitFor(() => {
      expect(result.current.events).toEqual([]);
      expect(toast).toHaveBeenCalledWith({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: '이벤트 로딩 실패',
      });
    });
  });

  it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
    const { result } = renderHook(() => useEventOperations(true));

    act(() => {
      result.current.saveEvent({
        id: '3',
        title: '기존',
        date: '2024-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: 'ㅂ 팀 미팅',
        location: '회의실 B',
        category: '업무릎팍',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      });
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        duration: 3000,
        isClosable: true,
        status: 'error',
        title: '일정 저장 실패',
      });
    });
  });

  it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
    const { result } = renderHook(() => useEventOperations(false));
    act(() => {
      server.use(
        http.delete('*', () => {
          return HttpResponse.error();
        })
      );
    });

    act(() => {
      result.current.deleteEvent('1');
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: '일정 삭제 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    });
  });
});
