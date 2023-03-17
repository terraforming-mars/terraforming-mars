import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';

export class DeclarationOfIndependence extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.DECLARATION_OF_INDEPENDENCE,
      cost: 20,
      tags: [Tag.MARS],
      requirements: CardRequirements.builder((b) => b.tag(Tag.MARS, 6)),
      victoryPoints: 4,

      behavior: {
        turmoil: {sendDelegates: {count: 2}},
      },

      metadata: {
        cardNumber: 'Pf34',
        renderData: CardRenderer.builder((b) => b.delegates(2).asterix),
        // TODO(kberg): remove "in reserve" to work like Cultural Metropolis.
        description: 'Requires that you have at least 6 Mars tags in play. Place 2 delegates in any party.',
      },
    });
  }
}

