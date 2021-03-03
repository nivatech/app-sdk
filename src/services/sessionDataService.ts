import runtime from '../context/RuntimeContext';

import { LogLevel } from '../sdk/LogLevel';
import { EventType } from '../sdk/EventType';
import { EventOrigin } from '../sdk/EventOrigin';
import appSdk from '../index';
import { SessionContext } from '../context/SessionContext';

class SessionDataService {
  public getContextAsync = async (): Promise<SessionContext> => {
    try {
      const r = await fetch(runtime.apiHost, {
        method: 'GET',
        credentials: 'omit',
        headers: {
          Authorization: `bearer ${runtime.token.value}`,
          'Content-Type': 'application/json',
        },
      });

      if (!r.ok) {
        appSdk?.logger.log({
          origin: EventOrigin.APP,
          type: EventType.INTERNAL,
          level: r.status === 404 ? LogLevel.DEBUG : LogLevel.ERROR,
          message: 'Session context fetch failed',
          context: [
            `status:${r.status}`,
            `statusText:${r.statusText}`,
            `sessionId:${runtime.sessionId}`,
          ],
        });

        throw new Error(
          `Sesson fetching failed. Status:${r.status}. SessionId:${runtime.sessionId}`
        );
      }

      return (await r.json()) as SessionContext;
    } catch (e) {
      appSdk?.logger.log({
        origin: EventOrigin.APP,
        type: EventType.INTERNAL,
        level: LogLevel.ERROR,
        message: 'Session context fetching failed with an error',
        context: [JSON.stringify(e), `sessionId:${runtime.sessionId}`],
      });
      throw e;
    }
  };
}

export default new SessionDataService();
