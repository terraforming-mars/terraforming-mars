
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class Grass implements IProjectCard {
    public cost = 11;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;
    public name = CardName.GRASS;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -16 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.plants += 3;
      return undefined;
    }
}
