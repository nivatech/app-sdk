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

  public locale: Locale = Locale.ENGLISH;

  public theme: Theme = Theme.LIGHT;

  /**
   * Correlation id sent as a part of init message from addon host
   *
   * @type {string}
   * @memberof RuntimeContext
   */
  public sessionId: string;

  public userIdentifier!: string;
}

export default new RuntimeContext();
