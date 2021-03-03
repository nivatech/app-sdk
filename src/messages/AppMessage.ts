import { AppMessageType } from './AppMessageType';

/**
 * SDK app message is sent and received from Papiri host or other apps.
 *
 * @export
 * @class AppMessage
 */
export abstract class AppMessage {
  /**
   *Creates an instance of AddonMessage.
   * @param {AppMessageType} type
   * @memberof AppMessage
   */
  constructor(type: AppMessageType) {
    this.type = type;
  }

  /**
   * Type of message being sent
   *
   * @type {string}
   * @memberof AddonMessage
   */
  public type: AppMessageType;
}
