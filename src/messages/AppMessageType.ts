/* eslint-disable no-unused-vars */
export enum AppMessageType {
  /**
   * Message sent from client to host signalizing that the client is ready for initialization
   */
  READY = 'nt:sdk:ready',

  /**
   * Message sent from host to client containing in its payload the context information
   * client needs to initialize addon experience.
   */
  INIT = 'nt:sdk:init',

  /**
   * Message sent from client to host requesting host to notify user about a message client has.
   * (e.g. requesting from host to show a toast informing user that addon had an error)
   */
  REQUEST_NOTIFY = 'nt:sdk:notify',

  /**
   * Message sent from host to addon containing the diagnostic info on addon loading
   */
  HOST_LOAD_INFO = 'nt:sdk:load',
}
