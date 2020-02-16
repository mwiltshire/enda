import { Endpoint } from '../endpoint';

describe('url method', () => {
  it('returns the URL as a string', () => {
    const endpoint = new Endpoint(
      'htts://www.example.com/project/{projectId}/todo/{todoId}',
      /{([^}]+)}/g,
      false
    );
    expect(endpoint.url()).toBe(
      'htts://www.example.com/project/{projectId}/todo/{todoId}'
    );
  });
});

describe('format method', () => {
  test('it accepts parameters as number or string values and returns the formated string', () => {
    const endpoint = new Endpoint(
      'htts://www.example.com/project/{projectId}/todo/{todoId}',
      /{([^}]+)}/g,
      false
    );
    const url = endpoint.format({ projectId: 1234, todoId: '5678' });
    expect(url).toBe('htts://www.example.com/project/1234/todo/5678');
  });
});
