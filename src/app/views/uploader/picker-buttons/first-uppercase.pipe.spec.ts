import { FirstUppercasePipe } from './first-uppercase.pipe';

describe('FirstUppercasePipe', () => {
  it('create an instance', () => {
    const pipe = new FirstUppercasePipe();
    expect(pipe).toBeTruthy();
  });
});
