import { Endpoint } from './endpoint';
import { join } from './join';
import { DEFAULT_BASE, DEFAULT_PARAM_MATCHER } from './constants';
import { EndaOptions, MakerFunction } from './types';

const isStringArray = (testArg: any): testArg is string[] => {
  return Array.isArray(testArg) && testArg.every(el => typeof el === 'string');
};

export class Enda<T = undefined> {
  private readonly _base: string;
  private readonly _parts?: T;
  private readonly _parameterMatcher: RegExp;
  private readonly _strictParameterMatching: boolean;

  /**
   * Create an `Enda` instance.
   *
   * Default options:
   *
   *  - base: `'/'`,
   *  - parameterMatcher: `/{([^}]+)}/g`,
   *  - strictParameterMatching: `true`
   *
   * @param options - Enda options.
   */
  constructor({
    base = DEFAULT_BASE,
    parts,
    parameterMatcher = DEFAULT_PARAM_MATCHER,
    strictParameterMatching = true
  }: EndaOptions<T> = {}) {
    this._base = base;
    this._parts = parts;
    this._parameterMatcher = parameterMatcher;
    this._strictParameterMatching = strictParameterMatching;
  }

  /**
   * Create an `Endpoint` instance.
   *
   * This overload takes any number of string arguments
   * and creates an `Endpoint` instance with the joined
   * args appended to the `base` as the underlying URL.
   * @param parts - The URL path parts.
   */
  make(...parts: string[]): Endpoint;
  /**
   * Create an `Endpoint` instance.
   *
   * This overload takes a maker function and creates an
   * `Endpoint` instance with the returned string values
   * appended to the `base` as the underlying URL.
   * @param maker - The maker function.
   */
  make(maker: MakerFunction<T>): Endpoint;
  /**
   * Create an `Endpoint` instance.
   *
   * This overload creates an `Endpoint` instance with
   * the `base` as its underlying URL.
   */
  make(): Endpoint;
  make(...args: string[] | [MakerFunction<T>]): Endpoint {
    let url: string;
    if (!args.length) {
      url = this._base;
    } else {
      const [arg0] = args;
      let path: string;
      if (typeof arg0 === 'function') {
        path = arg0({ parts: this._parts as T, join: this._join });
      } else if (isStringArray(args)) {
        path = this._join(...args);
      } else {
        throw new Error(
          'make expects to be passed a function or string arguments.'
        );
      }
      const base = this._base.endsWith('/') ? this._base : `${this._base}/`;
      url = `${base}${path}`;
    }
    return new Endpoint(
      url,
      this._parameterMatcher,
      this._strictParameterMatching
    );
  }

  private _join(...parts: string[]): string {
    return join(...parts);
  }
}
