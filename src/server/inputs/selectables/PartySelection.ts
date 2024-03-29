import { SelectionType } from '../../../common/input/SelectionType';
import { SelectionHandler } from './SelectionHandler';
import { IParty } from '../../turmoil/parties/IParty';
import { Message } from '@/common/logs/Message';

export class PartySelection extends SelectionHandler<IParty> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Confirm',
    parties: Array<IParty>,
  ) {
    super(parties, SelectionType.PARTY, title, buttonLabel);
  }

  public override GetOptionName(option: IParty): string {
    return option.name;
  }

  // The client already has information about turmoil and does not need a model
  public override OptionAsModel(): boolean {
    return true;
  }
}
