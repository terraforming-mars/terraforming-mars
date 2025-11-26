import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {all} from '@/server/cards/Options';

export class OrbitalPowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ORBITAL_POWER_GRID,
      type: CardType.AUTOMATED,
      tags: [Tag.POWER, Tag.SPACE],
      cost: 19,
      victoryPoints: 1,

      behavior: {
        production: {energy: {cities: {where: 'offmars'}}},
      },

      metadata: {
        description: 'Increase your energy production 1 step per city tile NOT ON MARS.',
        cardNumber: 'M85',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).slash().city({all, secondaryTag: Tag.SPACE});
        }),
      },
    });
  }
}
