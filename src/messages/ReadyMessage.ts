import { AppMessage } from './AppMessage';
import { AppMessageType } from './AppMessageType';

export class ReadyMessage extends AppMessage {
  /**
   *Creates an instance of ReadyMessage.
   * @memberof ReadyMessage
   */
  constructor() {
    super(AppMessageType.READY);
  }
}
