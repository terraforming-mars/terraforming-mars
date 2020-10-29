
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { CardName } from '../CardName';

export class ColonizerTrainingCamp implements IProjectCard {
    public cost = 8;
    public tags = [Tags.JOVIAN, Tags.STEEL];
    public name = CardName.COLONIZER_TRAINING_CAMP;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() <= 5 + player.getRequirementsBonus(game);
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
