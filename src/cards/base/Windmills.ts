
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PlayerInput} from '../../PlayerInput';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class Windmills implements IProjectCard {
    public cost = 6;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public name = CardName.WINDMILLS;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 7 - player.getRequirementsBonus(game);
    }
    public play(player: Player): PlayerInput | undefined {
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
