import { TokenInfo } from '../messages/TokenInfo';
import { Locale } from '../sdk/Locale';
import { Theme } from '../sdk/Theme';

export class RuntimeContext {
  /**
   * Addon host origin address.
   *
   * @type {string}
   * @memberof RuntimeContext
   */
  public origin: string;

  /**
   * Language locale to be used in rendering addon.
   *
   * @type {Locale}
   * @memberof RuntimeContext
   */
  public locale: Locale = Locale.ENGLISH;

  /**
   * A theme addon should be using in rendering.
   *
   * @type {Theme}
   * @memberof RuntimeContext
   */
  public theme: Theme = Theme.LIGHT;

  /**
   * Oauth token to be used by the app in accessing Papiri APIs
   *
   * @type {TokenInfo}
   * @memberof RuntimeContext
   */
  public token: TokenInfo;

  /**
   * Host of the api to be used when making a session call
   * e.g. https://argus.papiri.rs/v1
   *
   * @type {string}
   * @memberof RuntimeContext
   */
  public apiHost: string;

  /**
   * Correlation id sent as a part of init message from addon host
   *
   * @type {string}
   * @memberof RuntimeContext
   */
  public sessionId: string;
}

export default new RuntimeContext();
