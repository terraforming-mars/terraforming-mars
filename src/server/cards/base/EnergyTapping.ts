import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {Resource} from '@/common/Resource';
import {CardName} from '@/common/cards/CardName';
import {DecreaseAnyProduction} from '@/server/deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all} from '@/server/cards/Options';
import {GainProduction} from '@/server/deferredActions/GainProduction';

export class EnergyTapping extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ENERGY_TAPPING,
      tags: [Tag.POWER],
      cost: 3,
      victoryPoints: -1,

      metadata: {
        cardNumber: '201',
        description: 'Decrease any energy production 1 step and increase your own 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1, {all}).br;
            pb.plus().energy(1);
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const gainProduction = new GainProduction(player, Resource.ENERGY, {count: 1, log: false});
    const decreaseAnyProduction = new DecreaseAnyProduction(player, Resource.ENERGY, {count: 1, stealing: true});
    // If no player has energy production, then This Player must gain their energy production in order to lose it.
    if (player.game.players.filter((player) => player.production.energy > 0).length === 0) {
      player.game.defer(gainProduction).andThen(() => player.game.defer(decreaseAnyProduction));
    } else {
      player.game.defer(decreaseAnyProduction).andThen(() => player.game.defer(gainProduction));
    }
    return undefined;
  }
}
