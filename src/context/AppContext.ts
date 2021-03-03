import { Locale } from '../sdk/Locale';
import { Theme } from '../sdk/Theme';

export class AppContext {
  /**
   * Language locale to be used in rendering addon.
   *
   * @type {string}
   * @memberof Context
   */
  public locale: Locale;

  /**
   * A theme addon should be using in rendering.
   *
   * @type {Theme}
   * @memberof Context
   */
  public theme: Theme;

  /**
   * Unique identifier of the Outreach user.
   *
   * @type {string}
   * @memberof Context
   */
  public userIdentifier?: string;
}
