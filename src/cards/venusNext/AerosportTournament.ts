import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';


export class AerosportTournament implements IProjectCard {
  public cost = 7;
  public tags = [];
  public name = CardName.AEROSPORT_TOURNAMENT;
  public cardType = CardType.EVENT;
  public canPlay(player: Player): boolean {
    return player.getResourceCount(ResourceType.FLOATER) >= 5;
  }
  public play(player: Player, game: Game) {
    const amount = game.getCitiesInPlay();
    player.megaCredits += amount;
    LogHelper.logGainStandardResource(player, Resources.MEGACREDITS, amount);
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }

  public metadata: CardMetadata = {
    cardNumber: '214',
    description: 'Requires that you have 5 Floaters. Gain 1 MC per each City tile in play.',
    requirements: CardRequirements.builder((b) => b.floaters(5)),
    renderData: CardRenderer.builder((b) => {
      b.megacredits(1).slash().city(CardRenderItemSize.SMALL).any;
    }),
    victoryPoints: 1,
  }
}
