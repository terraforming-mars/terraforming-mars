
import {Game} from '../Game';
import {Player} from '../Player';
import {PlayerCallbackId} from './PlayerCallbackId';

export interface PlayerCallback {
  execute: () => void;
  game: Game;
  id: PlayerCallbackId;
  player?: Player;
}

