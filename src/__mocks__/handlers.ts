import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
const eventsState = {
  event: [...events],
};

export const handlers = [
  http.get('/api/events', () => {
    return HttpResponse.json({ events: eventsState.event });
  }),

  http.post('/api/events', async ({ request }) => {
    const newEvent: Event = (await request.json()) as Event;

    if (!newEvent) {
      return HttpResponse.json(null, { status: 404 });
    }

    eventsState.event = [...eventsState.event, newEvent];

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;

    const updateEvent = events.find((event) => event.id === id);
    if (!updateEvent) {
      return HttpResponse.json(null, { status: 404 });
    }

    const updatedEventData = (await request.json()) as Event;

    if (!updatedEventData) {
      return HttpResponse.json(null, { status: 404 });
    }

    eventsState.event = events.map((event) => {
      return event.id === id ? updatedEventData : event;
    });

    return HttpResponse.json(updatedEventData);
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;

    const deletedEvent = events.find((event) => event.id === id);
    if (!deletedEvent) {
      return new HttpResponse(null, { status: 404 });
    }

    eventsState.event = eventsState.event.filter((event) => event.id !== id);

    return HttpResponse.json(deletedEvent);
  }),
];
