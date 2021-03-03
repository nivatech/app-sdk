import { EventOrigin } from './sdk/EventOrigin';
import { EventType } from './sdk/EventType';
import { ILogger } from './sdk/Logger';
import { LogLevel } from './sdk/LogLevel';

// eslint-disable-next-line no-unused-vars
export class utils {
  public static getUrlDomain = (url: URL): string => {
    let originHost = `${url.protocol}//${url.hostname}`;

    if (url.port && url.port !== '443') {
      originHost += `:${url.port}`;
    }

    return originHost;
  };

  public static validHostOrigin = (
    origin: string,
    logger: ILogger
  ): boolean => {
    if (!origin) {
      return false;
    }
    const valid = origin.endsWith('papiri.rs');

    if (!valid) {
      logger.log({
        origin: EventOrigin.APP,
        type: EventType.INTERNAL,
        level: LogLevel.TRACE,
        message: '[NTP][AddonSdk]::validHostOrigin - invalid origin',
        context: [],
      });
      return false;
    }

    return true;
  };

  public static objectValues = (data: any) => {
    return Object.keys(data).map((key) => data[key]);
  };
}
