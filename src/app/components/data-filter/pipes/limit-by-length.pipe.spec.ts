import { LimitByLengthPipe } from './limit-by-length.pipe';

describe('LimitByLengthPipe', () => {
  it('create an instance', () => {
    const pipe = new LimitByLengthPipe();
    expect(pipe).toBeTruthy();
  });
});
