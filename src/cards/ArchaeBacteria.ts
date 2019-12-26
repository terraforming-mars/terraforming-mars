import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';

export class ArchaeBacteria implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = 'ArchaeBacteria';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() <= -18 + (
        player.getRequirementsBonus(game) * 2
      );
    }
    public play(player: Player) {
      player.plantProduction++;
      return undefined;
    }
}
