
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';

export class BreathingFilters implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = CardName.BREATHING_FILTERS;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 7 - player.getRequirementsBonus(game);
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
