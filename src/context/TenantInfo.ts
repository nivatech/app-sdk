/**
 * Information about the current session tenant.
 *
 * @export
 * @class TenantInfo
 */

export class TenantInfo {
    /**
     * Identity of the current tenant
     *
     * @type {string}
     * @memberof TenantInfo
     */
    public id: string;

    /**
     * Tenant name
     *
     * @type {string}
     * @memberof TenantInfo
     */
    public name: string;

    /**
     * Logo od the tenant (if any)
     *
     * @type {string}
     * @memberof TenantInfo
     */
    public logoUrl?: string;
}
