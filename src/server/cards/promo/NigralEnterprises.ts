import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';

export class NigralEnterprises extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.NIGRAL_ENTERPRISES,
      tags: [Tag.POWER, Tag.PLANT, Tag.BUILDING],
      startingMegaCredits: 27,
      type: CardType.CORPORATION,

      behavior: {
        production: {energy: 1, plants: 1, steel: 1},
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br;
          b.megacredits(27).production((pb) => pb.energy(1).plants(1).steel(1)).br;
          b.text('AWARDS AND MILESTONES ALWAYS COST 0 M€ FOR YOU.');
        }),
        description: 'You start with 27 M€. Raise your energy, plant, and steel production 1 step each.',
      },
    });
  }
}
