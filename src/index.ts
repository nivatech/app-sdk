/* eslint-disable no-unused-vars */

import { InitMessage } from './messages/InitMessage';
import { AppMessage } from './messages/AppMessage';
import { AppMessageType } from './messages/AppMessageType';
import { LogLevel } from './sdk/LogLevel';
import { AppContext } from './context/AppContext';
import { LoadingContext } from './context/LoadingContext';
import { ILogger, Logger } from './sdk/Logger';
import { EventOrigin } from './sdk/EventOrigin';
import { EventType } from './sdk/EventType';

import runtime, { RuntimeContext } from './context/RuntimeContext';
import {
  NotificationMessage,
  NotificationType,
} from './messages/NotificationMessage';
import { ReadyMessage } from './messages/ReadyMessage';
import { LoadInfoMessage } from './messages/LoadInfoMessage';
import { utils } from './utils';

import { Task } from './sdk/Task';

export * from './context/AppContext';
export * from './context/LoadingContext';
export * from './context/RuntimeContext';

export * from './messages/AppMessage';
export * from './messages/AppMessageType';
export * from './messages/InitMessage';
export * from './messages/LoadInfoMessage';
export * from './messages/NotificationMessage';
export * from './messages/ReadyMessage';

export * from './sdk/Color';
export * from './sdk/Event';
export * from './sdk/EventOrigin';
export * from './sdk/EventType';
export { ILogger } from './sdk/Logger';
export * from './sdk/Locale';
export * from './sdk/LogLevel';
export * from './sdk/Task';
export * from './sdk/Theme';

export * from './utils';

class AppSdk {
  private activeListener: boolean = false;
  private initTimer?: number;
  private initTask?: Task<AppContext>;

  public getRuntime = (): RuntimeContext => runtime;

  /**
   * Load handler is being invoked after the addon is fully loaded,
   * and it provides to addon creator performance information on addon loading.
   * Default implementation would show a toast if addon loading times were longer than 2 seconds.
   * Addon creator can implement its load handler and handle the received performance data
   * differently (report it to its telemetry service, show a custom addon UI, etc.)
   *
   * @memberof AddonsSdk
   */
  public onLoad: (context: LoadingContext) => void;

  public onMessage: (message: AppMessage) => void;

  public logger: ILogger = new Logger();

  /**
   * Creates an instance of AddonsSdk.
   * @memberof AddonsSdk
   */
  constructor() {
    this.onMessage = (message: AppMessage) => {
      this.logger.log({
        origin: EventOrigin.HOST,
        type: EventType.MESSAGE,
        messageType: message.type,
        level: LogLevel.INFO,
        message: `[NTP] Addon received message:${message.type}  from host`,
        context: [JSON.stringify(message)],
      });
    };

    // Default implementation of a handler showing a toast if loading times are longer then 2 seconds
    this.onLoad = (ctx: LoadingContext) => {
      const sessionId = this.getRuntime().sessionId;

      if (ctx.loadTime > 5000) {
        this.notify(
          `Addon loading takes longer than 5 seconds. Load time:${ctx.loadTime}. Ready time: ${ctx.readyTime}. SessionId: ${sessionId}`,
          'error'
        );
      } else if (ctx.loadTime > 2000) {
        this.notify(
          `Addon loading takes longer than 2 seconds. Load time:${ctx.loadTime}. Ready time: ${ctx.readyTime}. SessionId: ${sessionId}`,
          'warning'
        );
      }
    };
  }

  /**
   * Informs the interested parties that sdk is initialized and
   * ready to receive messages from host and other participants.
   *
   * @memberof AddonsSdk
   * @deprecated Since version 0.10. Will be removed in version 1.0. Use instead await sdk.init()
   */
  public ready() {
    console.warn('Ready function is depricated. Use instead await sdk.init()');

    this.init();
  }

  /**
   * Initialize the SDK by sending a ready() signal to the host
   * and resolving a promise when host responds with a current user
   * initialization context
   *
   * @returns {Promise<AppContext>}
   * @memberof AddonsSdk
   */
  public init = async (): Promise<AppContext> => {
    if (this.initTask) {
      return this.initTask.promise;
    }

    this.initTask = new Task<AppContext>();
    this.initTask.promise = new Promise<AppContext>((resolve, reject) => {
      this.initTask!.onfulfilled = resolve;
      this.initTask!.onrejected = reject;

      if (!this.activeListener) {
        this.activeListener = true;
        window.addEventListener('message', this.handleReceivedMessage);
      }

      const message = new ReadyMessage();
      const postMessage = JSON.stringify(message);

      this.logger.log({
        origin: EventOrigin.APP,
        type: EventType.MESSAGE,
        messageType: AppMessageType.READY,
        level: LogLevel.INFO,
        message: `[NTP] Addon is sending ${message.type} message to host`,
        context: [],
      });

      window.parent.postMessage(postMessage, '*');

      this.initTimer = window.setTimeout(() => {
        const error = '[NTP] Addon initialization failed - timeout error';
        console.error(error);
        reject(error);
      }, 10 * 1000);
    });

    return this.initTask.promise;
  };

  /**
   * Sends request to hosting app to notify user
   * about a certain even happening in addon.
   *
   * @memberof AddonsSdk
   */
  public notify = async (text: string, type: NotificationType) => {
    await this.verifySdkInitialized();

    const message = new NotificationMessage();
    message.notificationText = text;
    message.notificationType = type;
    this.sendMessage(message, true);

    this.logger.log({
      origin: EventOrigin.APP,
      type: EventType.MESSAGE,
      messageType: message.type,
      level: LogLevel.INFO,
      message: `[NTP] Addon is sending ${message.type} message to host`,
      context: [`Notification text: ${text}`, `Notification type: ${type}`],
    });
  };

  public sendMessage<T extends AppMessage>(message: T, logged?: boolean) {
    if (!runtime.origin) {
      console.error(
        '[NTP]You can not send messages before SDK is initialized',
        message
      );
      return;
    }
    const postMessage = JSON.stringify(message);

    if (!logged) {
      this.logger.log({
        origin: EventOrigin.APP,
        type: EventType.MESSAGE,
        messageType: message.type,
        level: LogLevel.INFO,
        message: `[NTP] App is sending ${message.type} message to host`,
        context: [postMessage, runtime.origin],
      });
    }

    window.parent.postMessage(postMessage, runtime.origin);
  }

  private verifySdkInitialized = async () => {
    // check if sdk.init() was called
    if (!this.initTask) {
      const error =
        '[NTP] Please initialize SDK by calling sdk.init() before performing any additional calls';
      this.logger.log({
        origin: EventOrigin.APP,
        type: EventType.INTERNAL,
        messageType: AppMessageType.INIT,
        level: LogLevel.ERROR,
        message: error,
        context: [runtime.origin],
      });

      // throw an error - case is THAT important
      throw new Error(error);
    }

    // check if sdk.init() was resolved
    await this.initTask;
  };

  private handleReceivedMessage = (messageEvent: MessageEvent) => {
    const appMessage = this.getAddonMessage(messageEvent);
    if (!appMessage) {
      this.logger.log({
        origin: EventOrigin.APP,
        type: EventType.INTERNAL,
        level: LogLevel.TRACE,
        message:
          '[NTP][AddonSdk]::handleReceivedMessage - ignoring event message as it is not addon message',
        context: [messageEvent.origin, JSON.stringify(messageEvent.data)],
      });
      return;
    }

    this.logger.log({
      origin: EventOrigin.HOST,
      type: EventType.MESSAGE,
      messageType: appMessage.type,
      level: LogLevel.INFO,
      message: `[NTP] Addon had received a ${appMessage.type} message from host`,
      context: [JSON.stringify(appMessage)],
    });

    switch (appMessage.type) {
      case AppMessageType.INIT: {
        const initMessage = appMessage as InitMessage;
        const context = this.preprocessInitMessage(initMessage);
        this.resolveInitPromise(context);
        break;
      }
      case AppMessageType.HOST_LOAD_INFO:
        this.handleLoadInfoMessage(appMessage as LoadInfoMessage);
        break;
      case AppMessageType.READY:
      case AppMessageType.REQUEST_NOTIFY:
        this.logger.log({
          origin: EventOrigin.APP,
          type: EventType.INTERNAL,
          message: `[NTP][AddonSdk] :: onReceived - Client event ${appMessage.type} received from host (NOP)`,
          level: LogLevel.WARNING,
          context: [JSON.stringify(appMessage)],
        });
        break;
      default:
        this.logger.log({
          origin: EventOrigin.APP,
          type: EventType.INTERNAL,
          message: `[NTP][AddonSdk] :: onReceived - Unknown event type: ${appMessage.type}`,
          level: LogLevel.WARNING,
          context: [JSON.stringify(appMessage)],
        });
    }
  };

  private preprocessInitMessage = (initMessage: InitMessage): AppContext => {
    runtime.locale = initMessage.locale;
    runtime.theme = initMessage.theme;
    runtime.userIdentifier = initMessage.userIdentifier;
    runtime.sessionId = initMessage.sessionId;

    const appContext = new AppContext();
    appContext.locale = runtime.locale;
    appContext.theme = runtime.theme;
    appContext.userIdentifier = runtime.userIdentifier;

    return appContext;
  };

  private resolveInitPromise = (appContext: AppContext) => {
    window.clearTimeout(this.initTimer);
    if (this.initTask) {
      this.initTask.onfulfilled(appContext);
    }
  };

  private handleLoadInfoMessage = (message: LoadInfoMessage) => {
    let logLevel = LogLevel.DEBUG;
    if (message.loadTime > 2000) {
      logLevel = LogLevel.ERROR;
    } else if (message.loadTime > 1000) {
      logLevel = LogLevel.WARNING;
    }

    this.logger.log({
      origin: EventOrigin.APP,
      type: EventType.MESSAGE,
      messageType: message.type,
      level: logLevel,
      message: `[NTP] Addon received message ${message.type} of type `,
      context: [JSON.stringify(message)],
    });

    const loadCtx: LoadingContext = {
      loadTime: message.loadTime,
      readyTime: message.readyTime,
    };

    this.onLoad(loadCtx);
  };

  private getAddonMessage = (messageEvent: MessageEvent): AppMessage | null => {
    if (!messageEvent) {
      return null;
    }

    const hostOrigin = utils.validHostOrigin(messageEvent.origin, this.logger);
    if (!hostOrigin) {
      this.logger.log({
        origin: EventOrigin.APP,
        type: EventType.INTERNAL,
        level: LogLevel.TRACE,
        message: '[NTP][AddonSdk]::getAddonMessage - invalid origin',
        context: [messageEvent.origin, `host:${hostOrigin}`],
      });
      return null;
    }

    if (!messageEvent.data || typeof messageEvent.data !== 'string') {
      this.logger.log({
        origin: EventOrigin.APP,
        type: EventType.INTERNAL,
        level: LogLevel.TRACE,
        message:
          '[NTP][AddonSdk]::getAddonMessage - message event data is not a string',
        context: [JSON.stringify(messageEvent.data)],
      });
      return null;
    }

    let hostMessage: AppMessage;
    try {
      hostMessage = JSON.parse(messageEvent.data);
      if (!hostMessage || !hostMessage.type) {
        this.logger.log({
          origin: EventOrigin.APP,
          type: EventType.INTERNAL,
          level: LogLevel.DEBUG,
          message:
            '[NTP][AddonSdk]::getAddonMessage - invalid message data format',
          context: [messageEvent.data],
        });

        return null;
      }
    } catch (e) {
      this.logger.log({
        origin: EventOrigin.APP,
        type: EventType.INTERNAL,
        level: LogLevel.DEBUG,
        message: '[NTP][AddonSdk]::getAddonMessage - not a json data',
        context: [messageEvent.data, JSON.stringify(e)],
      });

      return null;
    }

    if (!runtime.origin) {
      const initializedOrigin = this.initializeOrigin(
        hostMessage,
        messageEvent
      );
      if (!initializedOrigin) {
        this.logger.log({
          origin: EventOrigin.APP,
          type: EventType.INTERNAL,
          level: LogLevel.TRACE,
          message: '[NTP][AddonSdk]::getAddonMessage - origin not initialized',
          context: [],
        });
        return null;
      }
    }

    return hostMessage;
  };

  private initializeOrigin = (
    hostMessage: AppMessage,
    messageEvent: MessageEvent
  ) => {
    if (hostMessage.type !== AppMessageType.INIT) {
      return null;
    }

    if (!utils.validHostOrigin(messageEvent.origin, this.logger)) {
      return null;
    }

    this.logger.log({
      origin: EventOrigin.APP,
      type: EventType.INTERNAL,
      level: LogLevel.DEBUG,
      message: '[NTP][AddonSdk]::getAddonMessage- setting origin',
      context: [messageEvent.origin],
    });

    runtime.origin = messageEvent.origin;
    return runtime.origin;
  };
}

declare global {
  interface Window {
    nivatech: {
      log?: LogLevel;
      appSdk?: AppSdk;
    };
  }
}

// exposing sdk as  a global variable
window.nivatech = window.nivatech || {};
window.nivatech.appSdk = new AppSdk();

export default window.nivatech.appSdk;
