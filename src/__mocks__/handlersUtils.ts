import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };
// ! Hard
{
  /* 
  ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다.
  ! 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요 ?
  */
}
{
  /*  
  ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 
  ! 그리고 이 로직을 PR에 설명해주세요.
   */
}

export const setupHandler = () => {
  let eventsState = [...events];

  function resetInitState() {
    eventsState = [...events];
  }

  const setupMockHandlerRead = () => {
    const httpGetMethod = http.get('/api/events', () => {
      return HttpResponse.json({ events: eventsState });
    });

    return httpGetMethod;
  };

  const setupMockHandlerCreation = () => {
    const httpPostMethod = http.post('/api/events', async ({ request }) => {
      const newEvent: Event = (await request.json()) as Event;

      if (!newEvent) {
        return HttpResponse.json(null, { status: 404 });
      }

      eventsState = [...eventsState, newEvent];

      return HttpResponse.json(newEvent, { status: 201 });
    });

    return httpPostMethod;
  };

  const setupMockHandlerUpdating = () => {
    const httpPutMethod = http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;

      const updateEvent = events.find((event) => event.id === id);
      if (!updateEvent) {
        return HttpResponse.json(null, { status: 404 });
      }

      const updatedEventData = (await request.json()) as Event;

      if (!updatedEventData) {
        return HttpResponse.json(null, { status: 404 });
      }

      eventsState = eventsState.map((event) => {
        return event.id === id ? updatedEventData : event;
      });

      return HttpResponse.json(updatedEventData);
    });

    return httpPutMethod;
  };

  const setupMockHandlerDeletion = () => {
    const httpDeleteMethod = http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;

      const deletedEvent = events.find((event) => event.id === id);
      if (!deletedEvent) {
        return new HttpResponse(null, { status: 404 });
      }

      eventsState = eventsState.filter((event) => event.id !== id);

      return HttpResponse.json(deletedEvent);
    });

    return httpDeleteMethod;
  };

  return {
    resetInitState,
    setupMockHandlerRead,
    setupMockHandlerCreation,
    setupMockHandlerUpdating,
    setupMockHandlerDeletion,
  };
};
