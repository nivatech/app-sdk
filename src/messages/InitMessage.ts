/* eslint-disable no-unused-vars */
import { AppMessage } from './AppMessage';
import { AppMessageType } from './AppMessageType';
import { Theme } from '../sdk/Theme';
import { Locale } from '../sdk/Locale';
import { Color } from '../sdk/Color';

export class InitMessage extends AppMessage {
  /**
   *Creates an instance of InitMessage.
   * @memberof InitMessage
   */
  constructor() {
    super(AppMessageType.INIT);
  }

  /**
   * Language locale to be used in rendering addon.
   *
   * @type {Locale}
   * @memberof InitMessage
   */
  locale: Locale;

  /**
   * A theme addon should be using in rendering.
   *
   * @type {Theme}
   * @memberof InitMessage
   */
  theme: Theme;

  /**
   * Color of the current user.
   *
   * @type {Color}
   * @memberof InitMessage
   */
  color: Color;

  /**
   * Unique identifier hash of the user.
   *
   * @type {(string)}
   * @memberof InitMessage
   */
  userIdentifier: string;

  /**
   * Session id value is generated on host and is unique per addon loading.
   * If can be used used to correlate events on server and addon and enable
   * e2e tracking or it can be used when reporting an addon issue to Host.
   *
   * @type {string}
   * @memberof InitMessage
   */
  public sessionId: string;
}
