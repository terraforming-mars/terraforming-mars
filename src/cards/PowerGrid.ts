
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class PowerGrid implements IProjectCard {
    public cost = 18;
    public tags = [Tags.ENERGY];
    public name = CardName.POWER_GRID;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 1 + player.getTagCount(Tags.ENERGY));
      return undefined;
    }
}
