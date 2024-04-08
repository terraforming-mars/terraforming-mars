import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class OrbitalLaserDrill extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ORBITAL_LASER_DRILL,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 15,

      requirements: {tag: Tag.SCIENCE, count: 2},
      victoryPoints: 1,

      behavior: {
        underworld: {excavate: {count: 2, ignorePlacementRestrictions: true}},
      },

      metadata: {
        cardNumber: 'U33',
        renderData: CardRenderer.builder((b) => {
          b.excavate(2);
        }),
        description: 'Requires 2 science tags. Excavate 2 underground resources, IGNORING PLACEMENT RESTRICTIONS.',
      },
    });
  }
}
