import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';

export class CrashSiteCleanup extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.CRASH_SITE_CLEANUP,
      cost: 4,
      requirements: {plantsRemoved: true},
      victoryPoints: 1,

      metadata: {
        description: 'Requires that a player removed ANOTHER PLAYER\'s plants this generation. Gain 1 titanium or 2 steel.',
        cardNumber: 'X17',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).nbsp.or().nbsp.steel(2);
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const gainTitanium = new SelectOption(
      'Gain 1 titanium',
      'Gain titanium')
      .andThen(() => {
        player.stock.add(Resource.TITANIUM, 1, {log: true});
        return undefined;
      });

    const gain2Steel = new SelectOption(
      'Gain 2 steel',
      'Gain steel')
      .andThen(() => {
        player.stock.add(Resource.STEEL, 2, {log: true});
        return undefined;
      });

    return new OrOptions(gainTitanium, gain2Steel);
  }

  public static resourceHook(player: IPlayer, resource: Resource, amount: number, from: IPlayer) {
    if (from === player || amount >= 0) {
      return;
    }
    if (resource === Resource.PLANTS && amount < 0) {
      player.game.someoneHasRemovedOtherPlayersPlants = true;
    }
  }
}

