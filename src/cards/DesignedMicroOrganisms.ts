
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';

export class DesignedMicroOrganisms implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = 'Designed Micro-organisms';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() <= -14 + (
        2 * player.getRequirementsBonus(game)
      );
    }
    public play(player: Player) {
      player.setProduction(Resources.PLANTS,2);
      return undefined;
    }
}
