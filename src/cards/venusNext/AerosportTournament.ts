import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {LogHelper} from '../../LogHelper';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {Card} from '../Card';


export class AerosportTournament extends Card {
  constructor() {
    super({
      name: CardName.AEROSPORT_TOURNAMENT,
      cardType: CardType.EVENT,
      cost: 7,

      requirements: CardRequirements.builder((b) => b.floaters(5)),
      metadata: {
        cardNumber: '214',
        description: 'Requires that you have 5 Floaters. Gain 1 MC per each City tile in play.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().city(CardRenderItemSize.SMALL).any;
        }),
        victoryPoints: 1,
      },
    });
  };
  public canPlay(player: Player): boolean {
    return player.getResourceCount(ResourceType.FLOATER) >= 5;
  }
  public play(player: Player) {
    const amount = player.game.getCitiesInPlay();
    player.megaCredits += amount;
    LogHelper.logGainStandardResource(player, Resources.MEGACREDITS, amount);
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
