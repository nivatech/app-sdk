import { Locale } from '../sdk/Locale';
import { Theme } from '../sdk/Theme';
import { SessionContext } from './SessionContext';

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
   * Information about session user and tenant.
   *
   * @type {SessionContext}
   * @memberof AppContext
   */
  public session: SessionContext;
}
