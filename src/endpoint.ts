import { format } from './format';
import { PathParameters } from './types';

export class Endpoint {
  private readonly _url: string;
  private readonly _parameterMatcher: RegExp;
  private readonly _strictParameterMatching: boolean;

  constructor(
    url: string,
    parameterMatcher: RegExp,
    strictParameterMatching: boolean
  ) {
    this._url = url;
    this._parameterMatcher = parameterMatcher;
    this._strictParameterMatching = strictParameterMatching;
  }

  /**
   * Returns the endpoint URL as a string.
   */
  url(): string {
    return this._url;
  }

  /**
   * Format path parameters in the endpoint URL.
   *
   * Parameters are matched in the URL based on the `parameterMatcher`
   * Enda option. The default matcher is `/{([^}]+)}/g`
   *
   * ```js
   * // https://api.myapi.com/project/{projectId}
   * myEndpoint.format({ projectId: 23 }) // // https://api.myapi.com/project/23
   * ```
   * @param parameters Object containing path parameters
   * and their corresponding replacement values.
   */
  format(parameters: PathParameters): string {
    return format(
      this._url,
      parameters,
      this._parameterMatcher,
      this._strictParameterMatching
    );
  }
}
