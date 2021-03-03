import { Event } from './Event';
import { LogLevel } from './LogLevel';

export interface ILogger {
  /**
   * Minimal log level for event to be logged
   *
   * @type {LogLevel}
   * @memberof ILogger
   */
  level: LogLevel;
  /**
   * Logs an event for debugging purposes.
   *
   * @memberof ILogger
   */
  log: (event: Event) => void;
}

export class Logger implements ILogger {
  public level: LogLevel = window.nivatech.log || LogLevel.ERROR;

  public log = (event: Event) => {
    switch (event.level) {
      case LogLevel.NONE:
        // ignore the event
        break;
      case LogLevel.TRACE:
        if (this.level <= LogLevel.TRACE) {
          // tslint:disable-next-line: no-console
          console.log(
            '[NT][AppSdk]::onInfo-trace (default)',
            event,
            event.context
          );
        }
        break;
      case LogLevel.DEBUG:
        if (this.level <= LogLevel.DEBUG) {
          // tslint:disable-next-line: no-console
          console.log(
            '[NT][AppSdk]::onInfo-debug (default)',
            event,
            event.context
          );
        }
        break;
      case LogLevel.INFO:
        if (this.level <= LogLevel.INFO) {
          // tslint:disable-next-line: no-console
          console.info(
            '[NT][AppSdk]::onInfo-info (default)',
            event,
            event.context
          );
        }
        break;
      case LogLevel.WARNING:
        if (this.level <= LogLevel.WARNING) {
          // tslint:disable-next-line: no-console
          console.warn(
            '[NT][AppSdk]::onInfo-warning (default)',
            event,
            event.context
          );
        }
        break;
      case LogLevel.ERROR:
        // tslint:disable-next-line: no-console
        console.error(
          '[NT][AppSdk]::onInfo-error (default)',
          event,
          event.context
        );
        break;
    }
  };
}
