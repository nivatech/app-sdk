/**
 * Represents a token app should use to access Nivatech APIs.
 *
 * @export
 * @class TokenInfo
 */
export class TokenInfo {
  /**
   * Value of the JWT bearer token
   *
   * @type {string}
   * @memberof TokenInfo
   */
  public value: string;

  /**
   * Timestamp when a token will expire.
   *
   * @type {number}
   * @memberof TokenInfo
   */
  public expireAt: number;
}
