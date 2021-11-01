import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class CrashSiteCleanup extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CRASH_SITE_CLEANUP,
      cost: 4,
      requirements: CardRequirements.builder((b) => b.plantsRemoved()),
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

  public play(player: Player) {
    const gainTitanium = new SelectOption(
      'Gain 1 titanium',
      'Gain titanium',
      () => {
        player.addResource(Resources.TITANIUM, 1, {log: true});
        return undefined;
      },
    );

    const gain2Steel = new SelectOption(
      'Gain 2 steel',
      'Gain steel',
      () => {
        player.addResource(Resources.STEEL, 2, {log: true});
        return undefined;
      },
    );

    return new OrOptions(gainTitanium, gain2Steel);
  }

  public static resourceHook(player: Player, resource: Resources, amount: number, from: Player) {
    if (from === player || amount >= 0) {
      return;
    }
    if (resource === Resources.PLANTS && amount < 0) {
      player.game.someoneHasRemovedOtherPlayersPlants = true;
    }
  }
}

