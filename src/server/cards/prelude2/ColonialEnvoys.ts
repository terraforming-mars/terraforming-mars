import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../../common/turmoil/PartyName';

export class ColonialEnvoys extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 4,
      name: CardName.COLONIAL_ENVOYS,
      type: CardType.EVENT,
      requirements: {party: PartyName.UNITY},

      behavior: {
        turmoil: {sendDelegates: {count: {colonies: {}}, manyParties: true}},
      },

      metadata: {
        cardNumber: 'P70',
        description: 'Requires that Unity is ruling or that you have 2 delegates there. Place 1 delegate for each colony you have. YOU MAY PLACE THEM IN SEPERATE PARTIES.',
        renderData: CardRenderer.builder((b) => {
          b.delegates(1).asterix().slash().colonies(1).br;
        }),
      },
    });
  }
}
