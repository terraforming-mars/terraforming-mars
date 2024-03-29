import {Message} from '../../../common/logs/Message';
import {Space} from '../../boards/Space';
import { SelectionHandler } from './SelectionHandler';
import { SelectionType } from '@/common/input/SelectionType';

export class SelectSpace extends SelectionHandler<Space> {
  constructor(
    title: string | Message,
    spaces: Array<Space>,
  ) {
    super(spaces, SelectionType.SPACE, title);
    if (spaces.length === 0) {
      throw new Error('No available spaces');
    }
  }

  public override GetOptionName(option: Space): string {
    return option.id;
  }

  // Player already has information about the board
  public override OptionAsModel() {
    return undefined;
  }
}
