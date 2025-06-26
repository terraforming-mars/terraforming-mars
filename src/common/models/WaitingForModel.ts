import {Color} from '../Color';

export type WaitingForModel = {
  result:
    /** App is now waiting for this player to provide input. Refresh state. */
    'GO' |
    /** App has new state, web page should refresh state. */
    'REFRESH' |
    /** Nothing available yet. */
    'WAIT',

  /** List of players waiting for. */
  waitingFor: Array<Color>,
}
