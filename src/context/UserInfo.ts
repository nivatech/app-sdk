import { PredefinedRole } from '../enums/PredefinedRole';
import { Color } from '../sdk/Color';

/**
 * Information about user of the current session.
 *
 * @export
 * @class UserInfo
 */

export class UserInfo {
    /**
     * Avatar of the user
     *
     * @type {string}
     * @memberof UserInfo
     */
    public avatarUrl?: string;

    /**
     * Color of the current user.
     *
     * @type {Color}
     * @memberof UserInfo
     */
    public color: Color;

    /**
     * First name of the current user.
     *
     * @type {string}
     * @memberof UserInfo
     */
    public firstName: string;

    /**
     * Identity of the user
     *
     * @type {string}
     * @memberof UserInfo
     */
    public id: string;

    /**
     * Last name of the current user.
     *
     * @type {string}
     * @memberof UserInfo
     */
    public lastName: string;

    /**
     * Role of the current user in current tenant.
     *
     * @type {PredefinedRole}
     * @memberof UserInfo
     */
    public role: PredefinedRole;

    /**
     * Session id value is generated on host and is unique per app loading session.
     * If can be used used to correlate events on server and addon and enable
     * e2e tracking or it can be used when reporting an addon issue to Host.
     *
     * @type {string}
     * @memberof UserInfo
     */
    public sessionId: string;
}
