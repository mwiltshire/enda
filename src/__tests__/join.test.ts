import { join } from '../join';

it('joins string args using / character', () => {
  const joined = join('foo', 'bar', 'baz');
  expect(joined).toBe('foo/bar/baz');
});

it('removes / character if present any number of times at start of part', () => {
  const joined = join('/foo', '///bar', '/baz');
  expect(joined).toBe('foo/bar/baz');
});

it('returns empty string if passed empty string', () => {
  const joined = join('');
  expect(joined).toBe('');
});

it('does not join empty strings', () => {
  const joined = join('', '');
  expect(joined).toBe('');
});

it('ignores strings only containing / character', () => {
  const joined = join('foo', '/', 'bar', '///', 'baz');
  expect(joined).toBe('foo/bar/baz');
});

it('returns empty string if no argument passed', () => {
  const joined = join();
  expect(joined).toBe('');
});
