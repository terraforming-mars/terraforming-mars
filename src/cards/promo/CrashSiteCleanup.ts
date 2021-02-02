import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {LogHelper} from '../../LogHelper';
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
      metadata: {
        description: 'Requires that a player removed ANOTHER PLAYER\'s plants this generation. Gain 1 titanium or 2 steel.',
        cardNumber: 'X16',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).nbsp.or().nbsp.steel(2);
        }),
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player) {
    return player.game.someoneHasRemovedOtherPlayersPlants;
  }

  public play(player: Player) {
    const gainTitanium = new SelectOption(
      'Gain 1 titanium',
      'Gain titanium',
      () => {
        player.titanium++;
        LogHelper.logGainStandardResource(player, Resources.TITANIUM);
        return undefined;
      },
    );

    const gain2Steel = new SelectOption(
      'Gain 2 steel',
      'Gain steel',
      () => {
        player.steel += 2;
        LogHelper.logGainStandardResource(player, Resources.STEEL, 2);
        return undefined;
      },
    );

    return new OrOptions(gainTitanium, gain2Steel);
  }

  public getVictoryPoints() {
    return 1;
  }
}

