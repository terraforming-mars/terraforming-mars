
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class TundraFarming implements IProjectCard {
    public cost = 16;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.PLANT];
    public name = CardName.TUNDRA_FARMING;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -6 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      player.addProduction(Resources.MEGACREDITS, 2);
      player.plants++;
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
