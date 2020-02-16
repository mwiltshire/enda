export interface EndaOptions<T = undefined> {
  base?: string;
  parts?: T;
  parameterMatcher?: RegExp;
  strictParameterMatching?: boolean;
}

export type PathParameters = { [k: string]: string | number };

export type JoinFunction = (...string: string[]) => string;

export type MakerFunction<T = undefined> = (obj: {
  join: JoinFunction;
  parts: T;
}) => string;

export type FormatterFunction = (parameters?: PathParameters) => string;
