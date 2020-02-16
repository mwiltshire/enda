import { format } from '../format';

describe('correct formatting of url based on path parameters', () => {
  test('outermost match group is used if provided', () => {
    const formatted = format(
      'https://www.example.com/projects/{projectId}/todo/{todoId}',
      { projectId: 1234, todoId: '5678' },
      /{([^}]+)}/g,
      false
    );
    expect(formatted).toBe('https://www.example.com/projects/1234/todo/5678');
  });

  test('raw match is used if no outer match group is provided', () => {
    const formatted = format(
      'https://www.example.com/projects/projectId/todo/todoId',
      { projectId: 1234, todoId: '5678' },
      /projectId|todoId/g,
      false
    );
    expect(formatted).toBe('https://www.example.com/projects/1234/todo/5678');
  });

  test('multiple instances of same path parameter name in url are formatted', () => {
    const formatted = format(
      'https://www.example.com/projects/{uid}/todo/{uid}',
      { uid: 1234 },
      /{([^}]+)}/g,
      false
    );
    expect(formatted).toBe('https://www.example.com/projects/1234/todo/1234');
  });
});

describe('error handling', () => {
  it('throws error if no matches are found using regex pattern', () => {
    const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
    const pathParams = { projectId: 1234, todoId: '5678' };
    const regex = /<[^>]+>/g;
    expect(() => format(url, pathParams, regex, false)).toThrowError(
      'Search using /<[^>]+>/g returned no matches in string "https://www.example.com/projects/{projectId}/todo/{todoId}".'
    );
  });

  describe('with strict parameter matching', () => {
    it('throws error if found match is missing in path parameters object', () => {
      const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
      const pathParams = { projectId: 1234 };
      const regex = /{([^}]+)}/g;
      expect(() => format(url, pathParams, regex, true)).toThrowError(
        /Tried to replace parameter '{todoId}' but could not find property 'todoId' in*/
      );
    });

    it('throws error if pathParams parameter is undefined', () => {
      const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
      const regex = /{([^}]+)}/g;
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(() => format(url, undefined, regex, true)).toThrowError(
        /Tried to replace parameter '{projectId}' but could not find property 'projectId' in*/
      );
    });
  });

  describe('without strict parameter matching', () => {
    it('replaces parameter if possible, otherwise returns raw parameter', () => {
      const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
      const pathParams = { projectId: 1234 };
      const regex = /{([^}]+)}/g;
      expect(format(url, pathParams, regex, false)).toBe(
        'https://www.example.com/projects/1234/todo/{todoId}'
      );
    });
  });
});
