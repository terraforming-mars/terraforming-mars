import { SelectionType } from '../../../common/input/SelectionType';
import { Message } from '../../../common/logs/Message';
import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import { SelectionHandler } from './SelectionHandler';

export class GlobalEventSelection extends SelectionHandler<IGlobalEvent> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    events: Array<IGlobalEvent>,
  ) {
    super(events, SelectionType.EVENT, title, buttonLabel);
  }

  public override GetOptionName(option: IGlobalEvent): string {
    return option.name;
  }

  // The client already has information about turmoil
  public override OptionAsModel(): boolean {
    return true
  }
}
