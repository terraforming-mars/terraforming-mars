
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class Trees implements IProjectCard {
    public cost = 13;
    public tags = [Tags.PLANT];
    public name = CardName.TREES;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -4 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
      player.addProduction(Resources.PLANTS, 3);
      player.plants++;
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
