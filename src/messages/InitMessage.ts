/* eslint-disable no-unused-vars */
import { AppMessage } from './AppMessage';
import { AppMessageType } from './AppMessageType';
import { Theme } from '../sdk/Theme';
import { Locale } from '../sdk/Locale';
import { TokenInfo } from './TokenInfo';
import { TenantInfo } from '../context/TenantInfo';
import { UserInfo } from '../context/UserInfo';

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
   * Oauth token to be used by the app in accessing Papiri APIs
   *
   * @type {TokenInfo}
   * @memberof InitMessage
   */
  public tokenInfo: TokenInfo;

  /**
   * Collection of information about the current tenant.
   *
   * @type {TenantInfo}
   * @memberof SessionContext
   */
  public tenant: TenantInfo;

  /**
   * Collection of information about current user.
   *
   * @type {UserInfo}
   * @memberof SessionContext
   */
  public user: UserInfo;
}
