import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';


export class RiseToPower extends PreludeCard {
  constructor() {
    super({
      name: CardName.RISE_TO_POWER,

      behavior: {
        production: {megacredits: 3},
        turmoil: {sendDelegates: {count: 3, manyParties: true}},
      },

      metadata: {
        cardNumber: 'P60',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(3)).delegates(3).asterix().br;
        }),
        description: 'Increase your M€ production 3 steps and place 3 delegates. YOU MAY PLACE THEM IN SEPARATE PARTIES.',
      },
    });
  }
}
