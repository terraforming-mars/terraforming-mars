import {Game} from '../../Game';
import {PlayerCallback} from '../PlayerCallback';
import {PlayerCallbackId} from '../PlayerCallbackId';

export class NoopCallback implements PlayerCallback {
  public readonly id = PlayerCallbackId.NOOP;
  constructor(public game: Game) {}
  public execute() {}
}
