/* eslint-disable no-unused-vars */

import { AppMessage } from './AppMessage';
import { AppMessageType } from './AppMessageType';

export declare type NotificationType = 'success' | 'info' | 'warning' | 'error';

export class NotificationMessage extends AppMessage {
  /**
   *Creates an instance of NotificationMessage.
   * @memberof NotificationMessage
   */
  constructor() {
    super(AppMessageType.REQUEST_NOTIFY);
  }

  /**
   * Text of the notification to be shown
   *
   * @type {string}
   * @memberof NotificationMessage
   */
  public notificationText: string;

  /**
   * Type of notification being shown to Outreach user.
   *
   * @type {NotificationType}
   * @memberof NotificationMessage
   */
  public notificationType: NotificationType;
}
