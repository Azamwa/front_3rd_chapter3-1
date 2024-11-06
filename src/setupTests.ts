import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

// import { handlers } from './__mocks__/handlers';
import { setupHandler } from './__mocks__/handlersUtils';

/* msw */
export const server = setupServer();
let setupHandlerEvents = setupHandler();

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  setupHandlerEvents.resetInitState();
  const handlers = [
    setupHandlerEvents.setupMockHandlerRead(),
    setupHandlerEvents.setupMockHandlerDeletion(),
    setupHandlerEvents.setupMockHandlerCreation(),
    setupHandlerEvents.setupMockHandlerUpdating(),
  ];

  server.resetHandlers(...handlers);
  expect.hasAssertions();
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
