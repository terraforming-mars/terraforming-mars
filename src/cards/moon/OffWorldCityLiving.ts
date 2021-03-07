import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {LogHelper} from '../../LogHelper';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Card} from '../Card';

export class OffWorldCityLiving extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.OFF_WORLD_CITY_LIVING,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.SPACE],
      cost: 35,

      metadata: {
        // Check the card for a clever icon.
        description: 'Increase your MC production 1 step per each city tile NOT ON MARS. Increase Colony Rate 1 step. 1 VP for each 3 city tiles in play.',
        cardNumber: 'M53',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().city().asterix();
          b.br;
          b.moonColonyRate();
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 3),
      },
    });
  };

  public canPlay(): boolean {
    return true;
  }

  public play(player: Player) {
    const amount = player.game.getCitiesInPlay() - player.game.getCitiesInPlayOnMars();
    player.addProduction(Resources.MEGACREDITS, amount);
    LogHelper.logGainProduction(player, Resources.MEGACREDITS, amount);
    MoonExpansion.raiseColonyRate(player);
    return undefined;
  }

  public getVictoryPoints(player: Player) {
    const amount = player.game.getCitiesInPlay();
    return Math.floor(amount / 3);
  }
}
