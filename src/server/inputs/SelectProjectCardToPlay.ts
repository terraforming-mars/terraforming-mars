import {IProjectCard} from '../cards/IProjectCard';
import {IPlayer} from '../IPlayer';
import { SelectWithInput } from './basicInputs/SelectWithInput';
import { CardSelection } from './selectables/CardSelection';
import { SelectPayment } from './basicInputs/SelectPayment';

export class SelectProjectCardToPlay extends SelectWithInput<IProjectCard> {
  constructor(player: IPlayer) {
    super(
      new CardSelection<IProjectCard>('Play Project Card', 'Play card', player.getPlayableCards(), {played: false}), 
      (card: IProjectCard) => new SelectPayment('Select Payment', player.getCardCost(card), player.GetPaymentOptions(card))
    );
    this.cb = (card: IProjectCard) => {
      player.playCard(card);
      return undefined;
    }
  }
}
