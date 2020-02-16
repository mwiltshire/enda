/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Enda } from '../enda';
import { Endpoint } from '../endpoint';

jest.mock('../endpoint', () => ({
  Endpoint: jest.fn()
}));

describe('make method', () => {
  it('returns instance of Endpoint', () => {
    const enda = new Enda();
    expect(enda.make('project', 'todo')).toBeInstanceOf(Endpoint);
  });

  it('throws error if incorrect argument types supplied', () => {
    const enda = new Enda();
    const msg = 'make expects to be passed a function or string arguments.';
    // @ts-ignore
    expect(() => enda.make(1, 2, 3)).toThrowError(msg);
    // @ts-ignore
    expect(() => enda.make(null)).toThrowError(msg);
    // @ts-ignore
    expect(() => enda.make(undefined)).toThrowError(msg);
    // @ts-ignore
    expect(() => enda.make({})).toThrowError(msg);
    // @ts-ignore
    expect(() => enda.make([])).toThrowError(msg);
  });

  describe('constructing Endpoint instance - defaults', () => {
    test('constructor called correctly when no args are passed', () => {
      const enda = new Enda();
      enda.make();
      expect(Endpoint).toHaveBeenCalledWith('/', /{([^}]+)}/g, true);
    });

    test('constructor called correctly when string args are passed', () => {
      const enda = new Enda();
      enda.make('project', 'todo');
      expect(Endpoint).toHaveBeenCalledWith(
        '/project/todo',
        /{([^}]+)}/g,
        true
      );
    });

    test('constructor call correctly when function is passed - with parts', () => {
      const enda = new Enda({ parts: { project: 'project', todo: 'todo' } });
      enda.make(({ join, parts: { project, todo } }) => join(project, todo));
      expect(Endpoint).toHaveBeenCalledWith(
        '/project/todo',
        /{([^}]+)}/g,
        true
      );
    });

    test('constructor called correctly when function is passed - without parts', () => {
      const enda = new Enda();
      enda.make(({ join }) => join('project', 'todo'));
      expect(Endpoint).toHaveBeenCalledWith(
        '/project/todo',
        /{([^}]+)}/g,
        true
      );
    });
  });

  describe('constructing Endpoint instance - non-defaults', () => {
    test('constructor called correctly when no arguments passed to make', () => {
      const enda = new Enda({
        base: 'https://www.example.com',
        parameterMatcher: /<([^>]+)>/g,
        strictParameterMatching: false
      });
      enda.make();
      expect(Endpoint).toHaveBeenCalledWith(
        'https://www.example.com',
        /<([^>]+)>/g,
        false
      );
    });

    test('constructor called correctly when string arguments passed to make', () => {
      const enda = new Enda({
        base: 'https://www.example.com',
        parameterMatcher: /<([^>]+)>/g,
        strictParameterMatching: false
      });
      enda.make('project', 'todo');
      expect(Endpoint).toHaveBeenCalledWith(
        'https://www.example.com/project/todo',
        /<([^>]+)>/g,
        false
      );
    });

    test('constructor called correctly when function argument passed to make - with parts', () => {
      const enda = new Enda({
        base: 'https://www.example.com',
        parts: {
          project: 'project',
          todo: 'todo'
        },
        parameterMatcher: /<([^>]+)>/g,
        strictParameterMatching: false
      });
      enda.make(({ join, parts: { project, todo } }) => join(project, todo));
      expect(Endpoint).toHaveBeenCalledWith(
        'https://www.example.com/project/todo',
        /<([^>]+)>/g,
        false
      );
    });

    test('constructor called correctly when function argument passed to make - without parts', () => {
      const enda = new Enda({
        base: 'https://www.example.com',
        parameterMatcher: /<([^>]+)>/g,
        strictParameterMatching: false
      });
      enda.make(({ join }) => join('project', 'todo'));
      expect(Endpoint).toHaveBeenCalledWith(
        'https://www.example.com/project/todo',
        /<([^>]+)>/g,
        false
      );
    });
  });
});

describe('handling trailing forward slash in base URL', () => {
  test('URL path and base are not joined with / character as base already has a trailing /', () => {
    const enda = new Enda({ base: 'https://www.example.com/' });
    enda.make('projects', '{projectId}');
    expect(Endpoint).toHaveBeenCalledWith(
      'https://www.example.com/projects/{projectId}',
      /{([^}]+)}/g,
      true
    );
  });
});
