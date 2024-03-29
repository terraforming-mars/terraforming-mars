import { IPlayer } from '../../IPlayer';
import { SelectionType } from '../../../common/input/SelectionType';
import { Message } from '../../../common/logs/Message';
import { SelectionHandler } from './SelectionHandler';
import { Color } from '../../../common/Color';

export class PlayerSelection extends SelectionHandler<IPlayer> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    players: Array<IPlayer>,
  ) {
    super(players, SelectionType.PLAYER, title, buttonLabel);
  }

  public override GetOptionName(option: IPlayer): string {
    return option.id;
  }

  public override OptionAsModel(option: IPlayer): Color {
    return option.color;
  }
}