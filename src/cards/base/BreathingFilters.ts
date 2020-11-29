import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';

export class BreathingFilters implements IProjectCard {
  public cost = 11;
  public tags = [Tags.SCIENCE];
  public name = CardName.BREATHING_FILTERS;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player, game: Game): boolean {
    return game.getOxygenLevel() >= 7 - player.getRequirementsBonus(game);
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
  public metadata: CardMetadata = {
    description: 'Requires 7% oxygen.',
    cardNumber: '114',
    requirements: CardRequirements.builder((b) => b.oxygen(7)),
    victoryPoints: 2,
  };
}
