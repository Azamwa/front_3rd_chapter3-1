import { getTimeErrorMessage } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    const timeErrorMessage = getTimeErrorMessage('08:31', '06:50');
    expect(timeErrorMessage).toEqual({
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    });
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    const timeErrorMessage = getTimeErrorMessage('08:31', '08:31');
    expect(timeErrorMessage).toEqual({
      startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
      endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
    });
  });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    const timeErrorMessage = getTimeErrorMessage('04:20', '08:31');
    expect(timeErrorMessage).toEqual({ startTimeError: null, endTimeError: null });
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    const timeErrorMessage = getTimeErrorMessage('', '08:31');
    expect(timeErrorMessage).toEqual({ startTimeError: null, endTimeError: null });
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    const timeErrorMessage = getTimeErrorMessage('04:20', '');
    expect(timeErrorMessage).toEqual({ startTimeError: null, endTimeError: null });
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    const timeErrorMessage = getTimeErrorMessage('', '');
    expect(timeErrorMessage).toEqual({ startTimeError: null, endTimeError: null });
  });
});
