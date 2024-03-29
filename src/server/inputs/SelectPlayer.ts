import {Message} from '../../common/logs/Message';
import {IPlayer} from '../IPlayer';
import { SelectOne } from './basicInputs/SelectOne';
import { PlayerSelection } from './selectables/PlayerSelection';

export class SelectPlayer extends SelectOne<IPlayer> {
  constructor(
    public readonly players: Array<IPlayer>,
    title: string | Message,
    buttonLabel: string = 'Save'
  ) {
    super(new PlayerSelection(title, buttonLabel, players));
  }
}
