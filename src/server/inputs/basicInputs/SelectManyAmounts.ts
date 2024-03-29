import {AndOptionsResponse, InputResponse, SelectAmountResponse} from '../../../common/inputs/InputResponse';
import { AndOptions } from './AndOptions';
import { SelectAmount } from './SelectAmount';
import { IPlayer } from '@/server/IPlayer';
import { SelectionHandler } from '../selectables/SelectionHandler';
import { PlayerInput } from '../../PlayerInput';

export class SelectManyAmounts<T> extends AndOptions {
  constructor(
    selectionHandler: SelectionHandler<T>,
    public sum: number,
    eachSelection: (amount: number, option: T) => undefined | PlayerInput
  ) {
    super(selectionHandler.title, ...selectionHandler.options.map((option) => new SelectAmount(selectionHandler.GetOptionName(option), undefined, 0, sum).andThen((amount) => eachSelection(amount, option))));
    this.buttonLabel = selectionHandler.buttonLabel;
  }

  public override process(response: InputResponse, player: IPlayer) {
    let typedResponse = this.ResponseAsType<AndOptionsResponse>(response);
    if (typedResponse.responses.length !== this.options.length) {
      throw new Error('Incorrect options provided');
    }
    let total = 0;
    typedResponse.responses.forEach((secondaryResponse) => {
      let amountResponse = this.ResponseAsType<SelectAmountResponse>(secondaryResponse);
      total += amountResponse.amount;
    })
    if (total !== this.sum) {
      throw new Error('Incorrect amount provided');
    }
    for (let i = 0; i < typedResponse.responses.length; i++) {
      player.runInput(typedResponse.responses[i], this.options[i]);
    }    
    return this.cb(undefined);
  }
}
