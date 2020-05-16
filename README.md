<div align="center">
<h1>🌐 Enda</h1>
<p>A simple utility for managing API endpoint constants</p>
<img alt="Travis" src="https://img.shields.io/travis/com/mwiltshire/enda?style=flat-square">
<img alt="Codecov" src="https://img.shields.io/codecov/c/github/mwiltshire/enda?style=flat-square">
<img alt="license" src="https://img.shields.io/npm/l/enda?style=flat-square">
<img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square">
</div>
<hr />

Enda provides an interface for composing and formatting API endpoint URLs. It helps avoid potential typos by letting you maintain URL parts in a single place.

```js
import { Enda } from 'enda';

const enda = new Enda({
  base: 'https://api.myapi.com',
  parts: {
    projects: 'projects',
    tasks: 'tasks',
    versions: {
      v1: 'v1',
      v2: 'v2'
    },
    params: {
      projectId: '{projectId}',
      taskId: '{taskId}'
    }
  }
});

const PROJECT_TASK = enda.make(({ join, parts }) =>
  join(
    parts.versions.v1,
    parts.projects,
    parts.params.projectId,
    parts.tasks,
    parts.params.taskId
  )
);

const getProjectTask = (projectId, taskId) => {
  const url = PROJECT_TASK.format({ projectId, taskId }); // e.g. https://api.myapi.com/projects/23/tasks/2
  return makeRequest(url);
};
```

## Installation

Via npm:

```
npm install enda
```

## Usage

### **`new Enda([options])`**

- `options: EndaOptions`
  - `base?: string` Base URL - **Default** `'/'`
  - `parts?: {[k: string]: string}` URL parts
  - `parameterMatcher?: RegExp` Pattern used to match path parameters - **Default** `/{([^}]+)}/g`
  - `strictParameterMatching?: boolean` Whether an error will be thrown if a replacement for a path parameter matched by the `parameterMatcher` expression is not found when the `format` method is called - **Default** `true`

The `base` URL does not need to end with a `/` character. If not already present, this will be appended to `base` when joining paths.

Path parameters are matched based on the `parameterMatcher` Enda option. By default this is `/{([^}]+)}/g`. The method will use the matched contents of the first, outermost match group to look up a corresponding value in the path parameters object. If no match group is present, the full match will be used.

An error will be thrown if a match is found in the URL but no corresponding property is found in the path parameters object passed when formatting. You can disable this behavior by setting `strictParameterMatching` to `false` in the `Enda` options.

### `enda.make`

Constructing an `Enda` object will give you access to a `make` method that can be used to create endpoint URLs based on the options provided.

`make` is an overloaded method and can take its arguments in a number of forms:

#### `enda.make(): Endpoint`

Calling make with no arguments will simply give you back an Endpoint instance whose underlying URL is the base URL.

```js
import { Enda } from 'enda';

const enda = new Enda({ base: 'https://api.myapi.com' });

const base: Endpoint = enda.make();
base.url(); // https://api.myapi.com
```

#### `enda.make(...parts: string[]): Endpoint`

Calling make with any number of string arguments will give you back an Endpoint instance whose underlying URL is the base URL joined with the provided parts. Parts are joined using the `/` character, so there's no need to include this in each part string. `enda` will ignore any leading `/` characters.

```js
import { Enda } from 'enda';

const enda = new Enda();

const project: Endpoint = enda.make('projects', '{projectId}');
project.url(); // /projects/{projectId}

// Leading / characters will be ignored...
const tasks: Endpoint = enda.make('projects', '/{projectId}', '//tasks');
tasks.url(); // /projects/{projectId}/tasks
```

#### `enda.make(maker: MakerFunction): Endpoint`

If a function is provided as the first argument to `make` it will be called with an object containing a `join` helper function and the `parts` provided when constructing the `Enda` instance. If no parts were provided, then `parts` will be `undefined`.

```js
import { Enda } from 'enda';

const enda = new Enda({
  parts: {
    projects: 'projects',
    projectId: '{projectId}',
    tasks: 'tasks'
  }
});

const tasks: Endpoint = enda.make(({ join, parts }) =>
  join(parts.projects, parts.projectId, parts.tasks)
);
tasks.url(); // /projects/{projectId}/tasks

// You don't have to use the join helper function. As long as
// your function returns a string, you're set. You will need
// manually join using the / character though!
const task: Endpoint = enda.make(
  ({ parts: { projects, projectId, tasks } }) =>
    `${projects}/${projectId}/${tasks}/{taskId}`
);
task.url(); // /projects/{projectId}/tasks/{taskId}
```

### `Endpoint` methods

The `Endpoint` instance returned from `make` provides two additional methods.

#### `endpoint.url(): string`

Get the endpoint URL as a string.

```js
import { Enda } from 'enda';

const enda = new Enda({
  base: 'https://api.myapi.com'
});

const projects: Endpoint = enda.make('projects');

projects.url(); // https://api.myapi.com/projects
```

#### `endpoint.format(pathParameters: PathParameters): string`

- `pathParameters: PathParameters` Object mapping path parameters in the endpoint URL to their corresponding replacement values. Values can be either type `string` or `number`.

Format path parameters in the endpoint URL. The formatted URL will be returned as a string.

```js
import { Enda } from 'enda';

const enda = new Enda({
  parts: {
    projects: 'projects',
    projectId: '{projectId}',
    tasks: 'tasks',
    taskId: '{taskId}'
  }
});

const task: Endpoint = enda.make(({ join, parts }) =>
  join(parts.projects, parts.projectId, parts.tasks, parts.taskId)
);

task.format({ projectId: 23, taskId: '2' }); // /projects/23/tasks/2
```
