import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';

export class NirgalEnterprises extends Card implements ICorporationCard {
  constructor() {
    super({
      name: CardName.NIRGAL_ENTERPRISES,
      tags: [Tag.POWER, Tag.PLANT, Tag.BUILDING],
      startingMegaCredits: 33,
      type: CardType.CORPORATION,

      behavior: {
        production: {energy: 1, plants: 1, steel: 1},
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br;
          b.megacredits(33).production((pb) => pb.energy(1).plants(1).steel(1)).br;
          b.text('AWARDS AND MILESTONES ALWAYS COST 0 M€ FOR YOU.');
        }),
        description: 'You start with 33 M€. Raise your energy, plant, and steel production 1 step each.',
      },
    });
  }
}
