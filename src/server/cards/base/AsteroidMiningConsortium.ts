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

export class AsteroidMiningConsortium extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ASTEROID_MINING_CONSORTIUM,
      tags: [Tag.JOVIAN],
      cost: 13,
      victoryPoints: 1,

      requirements: {production: Resource.TITANIUM, count: 1},
      metadata: {
        description: 'Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step.',
        cardNumber: '002',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().titanium(-1, {all}).br;
            pb.plus().titanium(1);
          });
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    if (player.game.players.length > 1) {
      const eligiblePlayers = player.game.players.filter((p) => p.production.titanium > 0);
      if (eligiblePlayers.length === 1 && eligiblePlayers[0] === player) {
        this.warnings.add('selfTarget');
      }
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new DecreaseAnyProduction(
      player,
      Resource.TITANIUM,
      {count: 1, stealing: true},
    ));
    player.game.defer(new GainProduction(player, Resource.TITANIUM, {count: 1, log: false}));
    return undefined;
  }
}
