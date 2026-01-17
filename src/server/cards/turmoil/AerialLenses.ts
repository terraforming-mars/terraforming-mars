import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {PartyName} from '@/common/turmoil/PartyName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all} from '@/server/cards/Options';

export class AerialLenses extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.AERIAL_LENSES,
      cost: 2,
      victoryPoints: -1,

      behavior: {
        production: {heat: 2},
        removeAnyPlants: 2,
      },

      requirements: {party: PartyName.KELVINISTS},
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there. Remove up to 2 plants from any player. Increase your heat production 2 steps.',
        cardNumber: 'T01',
        renderData: CardRenderer.builder((b) => b.minus().plants(-2, {all}).production((pb) => pb.heat(2))),
      },
    });
  }
}
