import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { OverlayProvider } from 'overlay-kit';

import App from '../App';

const renderApp = () => {
  return render(
    <ChakraProvider>
      <OverlayProvider>
        <App />
      </OverlayProvider>
    </ChakraProvider>
  );
};

describe('일정 CRUD 및 기본 기능', () => {
  vi.setSystemTime(new Date('2024-10-14'));

  it('반복일정 체크박스를 해제하면 반복설정 폼이 사라진다.', async () => {
    renderApp();

    const repeatSettingCheckbox: HTMLInputElement = screen.getByLabelText(/반복 설정/i);
    const repeatTypeSelect: HTMLSelectElement = screen.getByLabelText(/반복 유형/i);
    const repeatIntervalSelect: HTMLSelectElement = screen.getByLabelText(/반복 간격/i);
    const repeatEndTimeInput: HTMLInputElement = screen.getByLabelText(/반복 종료일/i);

    expect(repeatSettingCheckbox).toBeInTheDocument();
    expect(repeatSettingCheckbox.checked).toBe(true);
    expect(repeatTypeSelect.value).toBe('daily');
    expect(repeatIntervalSelect.value).toBe('1');
    expect(repeatEndTimeInput.value).toBe('');

    await userEvent.click(repeatSettingCheckbox);

    expect(repeatSettingCheckbox.checked).toBe(false);

    await waitFor(() => {
      expect(repeatTypeSelect).not.toBeInTheDocument();
      expect(repeatIntervalSelect).not.toBeInTheDocument();
      expect(repeatEndTimeInput).not.toBeInTheDocument();
    });
  });

  it('데이터베이스에 저장된 일정을 호출하고, 리스트에 반영한다.', async () => {
    renderApp();

    const eventList = screen.getByTestId(/event-list/i);
    const eventTitle = await within(eventList).findByText(/기존 회의/i);
    const eventDate = await within(eventList).findByText(/2024-10-15/i);
    const eventStartTime = await within(eventList).findByText(/09:00 - 10:00/i);
    const eventDescription = await within(eventList).findByText(/기존 팀 미팅/i);
    const eventLocation = await within(eventList).findByText(/회의실 B/i);
    const eventCategory = await within(eventList).findByText(/카테고리: 업무/i);
    const eventRepeatInterval = await within(eventList).findByText(/알림: 10분 전/i);

    expect(eventTitle).toBeInTheDocument();
    expect(eventDate).toBeInTheDocument();
    expect(eventStartTime).toBeInTheDocument();
    expect(eventDescription).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(eventCategory).toBeInTheDocument();
    expect(eventRepeatInterval).toBeInTheDocument();
  });

  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    renderApp();

    const titleInput: HTMLInputElement = screen.getByLabelText(/제목/i);
    const dateInput: HTMLInputElement = screen.getByLabelText(/날짜/i);
    const startTimeInput: HTMLInputElement = screen.getByLabelText(/시작 시간/i);
    const endTimeInput: HTMLInputElement = screen.getByLabelText(/종료 시간/i);
    const descriptionInput: HTMLInputElement = screen.getByLabelText(/설명/i);
    const locationInput: HTMLInputElement = screen.getByLabelText(/위치/i);
    const categorySelect: HTMLSelectElement = screen.getByLabelText(/카테고리/i);
    const notificationTimeSelect: HTMLSelectElement = screen.getByLabelText(/알림 설정/i);
    const repeatTypeSelect: HTMLSelectElement = screen.getByLabelText(/반복 유형/i);
    const repeatIntervalInput: HTMLInputElement = screen.getByLabelText(/반복 간격/i);
    const repeatEndTimeInput: HTMLInputElement = screen.getByLabelText(/반복 종료일/i);

    await userEvent.type(titleInput, '응애');
    await userEvent.type(dateInput, '2024-10-05');
    await userEvent.type(startTimeInput, '13:00');
    await userEvent.type(endTimeInput, '14:00');
    await userEvent.type(descriptionInput, '나 테스트 못해');
    await userEvent.type(locationInput, '유모차안');
    await userEvent.selectOptions(categorySelect, '개인');
    await userEvent.selectOptions(notificationTimeSelect, '10');
    await userEvent.selectOptions(repeatTypeSelect, 'daily');
    await userEvent.type(repeatIntervalInput, '10');
    await userEvent.type(repeatEndTimeInput, '2024-11-05');

    const addEventButton = screen.getByRole('button', { name: /일정 추가/i });
    await userEvent.click(addEventButton);

    const eventList = screen.getByTestId(/event-list/i);

    const eventTitle = await within(eventList).findByText(/응애/i);
    const eventDate = await within(eventList).findByText(/2024-10-05/i);
    const eventStartTime = await within(eventList).findByText(/13:00 - 14:00/i);
    const eventDescription = await within(eventList).findByText(/나 테스트 못해/i);
    const eventLocation = await within(eventList).findByText(/유모차안/i);
    const eventCategory = await within(eventList).findByText(/카테고리: 개인/i);

    expect(eventTitle).toBeInTheDocument();
    expect(eventDate).toBeInTheDocument();
    expect(eventStartTime).toBeInTheDocument();
    expect(eventDescription).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(eventCategory).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    renderApp();

    const eventList = screen.getByTestId(/event-list/i);
    const eventTitle = await within(eventList).findByText(/기존 회의/i);
    const eventDate = await within(eventList).findByText(/2024-10-15/i);
    const eventStartTime = await within(eventList).findByText(/09:00 - 10:00/i);
    const eventDescription = await within(eventList).findByText(/기존 팀 미팅/i);
    const eventLocation = await within(eventList).findByText(/회의실 B/i);
    const eventCategory = await within(eventList).findByText(/카테고리: 업무/i);
    const eventRepeatInterval = await within(eventList).findByText(/알림: 10분 전/i);

    const editButton = await within(eventList).getByLabelText(/Edit event/i);
    await userEvent.click(editButton);

    const titleInput: HTMLInputElement = screen.getByLabelText(/제목/i);
    const descriptionInput: HTMLInputElement = screen.getByLabelText(/설명/i);
    const locationInput: HTMLInputElement = screen.getByLabelText(/위치/i);
    const categorySelect: HTMLSelectElement = screen.getByLabelText(/카테고리/i);

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '응애 밥줘');

    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, '참치 1번 대뱃살로');

    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, '스시야');

    await userEvent.selectOptions(categorySelect, '기타');

    const registUpdateButton = screen.getByTestId(/event-submit-button/i);
    await userEvent.click(registUpdateButton);

    expect(eventTitle.textContent).toBe('응애 밥줘');
    expect(eventDate.textContent).toBe('2024-10-15');
    expect(eventStartTime.textContent).toBe('09:00 - 10:00');
    expect(eventDescription.textContent).toBe('참치 1번 대뱃살로');
    expect(eventLocation.textContent).toBe('스시야');
    expect(eventCategory.textContent).toBe('카테고리: 기타');
    expect(eventRepeatInterval.textContent).toBe('알림: 10분 전');
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    renderApp();

    const eventList = screen.getByTestId(/event-list/i);
    const eventTitle = await within(eventList).findByText(/기존 회의/i);
    const eventDate = await within(eventList).findByText(/2024-10-15/i);
    const eventStartTime = await within(eventList).findByText(/09:00 - 10:00/i);
    const eventDescription = await within(eventList).findByText(/기존 팀 미팅/i);
    const eventLocation = await within(eventList).findByText(/회의실 B/i);
    const eventCategory = await within(eventList).findByText(/카테고리: 업무/i);
    const eventRepeatInterval = await within(eventList).findByText(/알림: 10분 전/i);

    const deleteButton = await within(eventList).getByLabelText(/Delete event/i);
    await userEvent.click(deleteButton);

    expect(eventTitle).not.toBeInTheDocument();
    expect(eventDate).not.toBeInTheDocument();
    expect(eventStartTime).not.toBeInTheDocument();
    expect(eventDescription).not.toBeInTheDocument();
    expect(eventLocation).not.toBeInTheDocument();
    expect(eventCategory).not.toBeInTheDocument();
    expect(eventRepeatInterval).not.toBeInTheDocument();
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    vi.setSystemTime(new Date('2024-11-09'));
    renderApp();

    const viewSelect: HTMLSelectElement = screen.getByLabelText(/view/i);
    await userEvent.selectOptions(viewSelect, 'week');
    const emptyEventText = await screen.findByText(/검색 결과가 없습니다/i);
    expect(emptyEventText).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    vi.setSystemTime(new Date('2024-10-14'));
    renderApp();

    const viewSelect: HTMLSelectElement = screen.getByLabelText(/view/i);
    await userEvent.selectOptions(viewSelect, 'week');

    const eventList = screen.getByTestId(/event-list/i);
    const eventTitle = await within(eventList).findByText(/기존 회의/i);
    const eventDate = await within(eventList).findByText(/2024-10-15/i);
    const eventStartTime = await within(eventList).findByText(/09:00 - 10:00/i);
    const eventDescription = await within(eventList).findByText(/기존 팀 미팅/i);
    const eventLocation = await within(eventList).findByText(/회의실 B/i);
    const eventCategory = await within(eventList).findByText(/카테고리: 업무/i);

    expect(eventTitle).toBeInTheDocument();
    expect(eventDate).toBeInTheDocument();
    expect(eventStartTime).toBeInTheDocument();
    expect(eventDescription).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(eventCategory).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    vi.setSystemTime(new Date('2024-02-14'));
    renderApp();

    const emptyEventText = await screen.findByText(/검색 결과가 없습니다/i);
    expect(emptyEventText).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-10-14'));
    renderApp();

    const eventList = screen.getByTestId(/event-list/i);
    const eventTitle = await within(eventList).findByText(/기존 회의/i);
    const eventDate = await within(eventList).findByText(/2024-10-15/i);
    const eventStartTime = await within(eventList).findByText(/09:00 - 10:00/i);
    const eventDescription = await within(eventList).findByText(/기존 팀 미팅/i);
    const eventLocation = await within(eventList).findByText(/회의실 B/i);
    const eventCategory = await within(eventList).findByText(/카테고리: 업무/i);

    expect(eventTitle).toBeInTheDocument();
    expect(eventDate).toBeInTheDocument();
    expect(eventStartTime).toBeInTheDocument();
    expect(eventDescription).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(eventCategory).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-01-01'));
    renderApp();

    const HAPPY_NEW_YEAR = await screen.findByText(/신정/);
    expect(HAPPY_NEW_YEAR).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    vi.setSystemTime(new Date('2024-10-14'));
    renderApp();

    const eventList = screen.getByTestId(/event-list/i);
    const eventTitle = await within(eventList).findByText(/기존 회의/i);

    expect(eventTitle).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/일정 검색/i);
    await userEvent.type(searchInput, '크크루삥뽕');

    const emptyEventText = await screen.findByText(/검색 결과가 없습니다/i);
    expect(emptyEventText).toBeInTheDocument();
    expect(eventTitle).not.toBeInTheDocument();
  });

  it("'응애'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    vi.setSystemTime(new Date('2024-10-14'));
    renderApp();

    const eventList = screen.getByTestId(/event-list/i);
    const existingEventTitle = await within(eventList).findByText(/기존 회의/i);
    expect(existingEventTitle).toBeInTheDocument();

    const titleInput: HTMLInputElement = screen.getByLabelText(/제목/i);
    const dateInput: HTMLInputElement = screen.getByLabelText(/날짜/i);
    const startTimeInput: HTMLInputElement = screen.getByLabelText(/시작 시간/i);
    const endTimeInput: HTMLInputElement = screen.getByLabelText(/종료 시간/i);
    const descriptionInput: HTMLInputElement = screen.getByLabelText(/설명/i);
    const locationInput: HTMLInputElement = screen.getByLabelText(/위치/i);
    const categorySelect: HTMLSelectElement = screen.getByLabelText(/카테고리/i);
    const notificationTimeSelect: HTMLSelectElement = screen.getByLabelText(/알림 설정/i);
    const repeatTypeSelect: HTMLSelectElement = screen.getByLabelText(/반복 유형/i);
    const repeatIntervalInput: HTMLInputElement = screen.getByLabelText(/반복 간격/i);
    const repeatEndTimeInput: HTMLInputElement = screen.getByLabelText(/반복 종료일/i);

    await userEvent.type(titleInput, '응애');
    await userEvent.type(dateInput, '2024-10-05');
    await userEvent.type(startTimeInput, '13:00');
    await userEvent.type(endTimeInput, '14:00');
    await userEvent.type(descriptionInput, '나 테스트 못해');
    await userEvent.type(locationInput, '유모차안');
    await userEvent.selectOptions(categorySelect, '개인');
    await userEvent.selectOptions(notificationTimeSelect, '10');
    await userEvent.selectOptions(repeatTypeSelect, 'daily');
    await userEvent.type(repeatIntervalInput, '10');
    await userEvent.type(repeatEndTimeInput, '2024-11-05');

    const addEventButton = screen.getByRole('button', { name: /일정 추가/i });
    await userEvent.click(addEventButton);

    const searchInput = screen.getByLabelText(/일정 검색/i);
    await userEvent.type(searchInput, '응애');

    const eventTitle = await within(eventList).findByText(/응애/i);
    const eventDate = await within(eventList).findByText(/2024-10-05/i);
    const eventStartTime = await within(eventList).findByText(/13:00 - 14:00/i);
    const eventDescription = await within(eventList).findByText(/나 테스트 못해/i);
    const eventLocation = await within(eventList).findByText(/유모차안/i);
    const eventCategory = await within(eventList).findByText(/카테고리: 개인/i);

    expect(existingEventTitle).not.toBeInTheDocument();

    expect(eventTitle).toBeInTheDocument();
    expect(eventDate).toBeInTheDocument();
    expect(eventStartTime).toBeInTheDocument();
    expect(eventDescription).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(eventCategory).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    vi.setSystemTime(new Date('2024-10-14'));
    renderApp();

    const eventList = screen.getByTestId(/event-list/i);
    const existingEventTitle = await within(eventList).findByText(/기존 회의/i);
    expect(existingEventTitle).toBeInTheDocument();

    const titleInput: HTMLInputElement = screen.getByLabelText(/제목/i);
    const dateInput: HTMLInputElement = screen.getByLabelText(/날짜/i);
    const startTimeInput: HTMLInputElement = screen.getByLabelText(/시작 시간/i);
    const endTimeInput: HTMLInputElement = screen.getByLabelText(/종료 시간/i);
    const descriptionInput: HTMLInputElement = screen.getByLabelText(/설명/i);
    const locationInput: HTMLInputElement = screen.getByLabelText(/위치/i);
    const categorySelect: HTMLSelectElement = screen.getByLabelText(/카테고리/i);

    await userEvent.type(titleInput, '응애');
    await userEvent.type(dateInput, '2024-10-05');
    await userEvent.type(startTimeInput, '13:00');
    await userEvent.type(endTimeInput, '14:00');
    await userEvent.type(descriptionInput, '나 테스트 못해');
    await userEvent.type(locationInput, '유모차안');
    await userEvent.selectOptions(categorySelect, '개인');

    const addEventButton = screen.getByRole('button', { name: /일정 추가/i });
    await userEvent.click(addEventButton);

    const searchInput: HTMLInputElement = screen.getByLabelText(/일정 검색/i);
    await userEvent.type(searchInput, '응애');

    const eventTitle = await within(eventList).findByText(/응애/i);

    expect(existingEventTitle).not.toBeInTheDocument();
    expect(eventTitle).toBeInTheDocument();

    await userEvent.clear(searchInput);

    await waitFor(() => {
      expect(within(eventList).getByText(/응애/i)).toBeInTheDocument();
      expect(within(eventList).getByText(/기존 회의/i)).toBeInTheDocument();
    });
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    renderApp();

    const titleInput: HTMLInputElement = screen.getByLabelText(/제목/i);
    const dateInput: HTMLInputElement = screen.getByLabelText(/날짜/i);
    const startTimeInput: HTMLInputElement = screen.getByLabelText(/시작 시간/i);
    const endTimeInput: HTMLInputElement = screen.getByLabelText(/종료 시간/i);
    const descriptionInput: HTMLInputElement = screen.getByLabelText(/설명/i);
    const locationInput: HTMLInputElement = screen.getByLabelText(/위치/i);
    const categorySelect: HTMLSelectElement = screen.getByLabelText(/카테고리/i);

    await userEvent.type(titleInput, '응애');
    await userEvent.type(dateInput, '2024-10-15');
    await userEvent.type(startTimeInput, '09:00');
    await userEvent.type(endTimeInput, '10:00');
    await userEvent.type(descriptionInput, '나 테스트 못해');
    await userEvent.type(locationInput, '유모차안');
    await userEvent.selectOptions(categorySelect, '개인');

    const addEventButton = screen.getByRole('button', { name: /일정 추가/i });
    await userEvent.click(addEventButton);

    const overlapEventDialog = await screen.findByText(/일정 겹침 경고/i);
    expect(overlapEventDialog).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    renderApp();

    const titleInput: HTMLInputElement = screen.getByLabelText(/제목/i);
    const dateInput: HTMLInputElement = screen.getByLabelText(/날짜/i);
    const startTimeInput: HTMLInputElement = screen.getByLabelText(/시작 시간/i);
    const endTimeInput: HTMLInputElement = screen.getByLabelText(/종료 시간/i);
    const descriptionInput: HTMLInputElement = screen.getByLabelText(/설명/i);
    const locationInput: HTMLInputElement = screen.getByLabelText(/위치/i);
    const categorySelect: HTMLSelectElement = screen.getByLabelText(/카테고리/i);

    await userEvent.type(titleInput, '응애');
    await userEvent.type(dateInput, '2024-10-05');
    await userEvent.type(startTimeInput, '13:00');
    await userEvent.type(endTimeInput, '14:00');
    await userEvent.type(descriptionInput, '나 테스트 못해');
    await userEvent.type(locationInput, '유모차안');
    await userEvent.selectOptions(categorySelect, '개인');

    const addEventButton = screen.getByRole('button', { name: /일정 추가/i });
    await userEvent.click(addEventButton);

    const eventList = screen.getByTestId(/event-list/i);

    const eventTitle = await within(eventList).findByText(/응애/i);
    expect(eventTitle).toBeInTheDocument();

    const editButton = await within(eventList).findAllByLabelText(/Edit event/i);
    await userEvent.click(editButton[1]);

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '응애 밥줘');

    const registUpdateButton = screen.getByRole('button', { name: /일정 수정/i });
    await userEvent.click(registUpdateButton);

    expect(eventTitle.textContent).toBe('응애 밥줘');
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  vi.setSystemTime(new Date('2024-10-15T08:50'));
  renderApp();

  const eventList = screen.getByTestId(/event-list/i);

  const eventRepeatInterval = await within(eventList).findByText(/알림: 10분 전/i);
  expect(eventRepeatInterval).toBeInTheDocument();

  const notificationAlarm = await screen.findByText(/10분 후 기존 회의 일정이 시작됩니다/i);
  expect(notificationAlarm).toBeInTheDocument();
});
