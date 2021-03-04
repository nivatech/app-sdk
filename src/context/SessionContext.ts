import { TenantInfo } from './TenantInfo';
import { UserInfo } from './UserInfo';

export class SessionContext {
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
