
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class NoctisFarming implements IProjectCard {
    public cost = 10;
    public tags = [Tags.PLANT, Tags.STEEL];
    public name = CardName.NOCTIS_FARMING;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -20 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS);
      player.plants += 2;
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
