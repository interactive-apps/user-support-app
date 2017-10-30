import { FilterByKeyValuesPipe } from './filter-by-key-values.pipe';

describe('FilterByKeyValuesPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByKeyValuesPipe();
    expect(pipe).toBeTruthy();
  });
});
