
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class Satellites implements IProjectCard {
    public cost = 10;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.SPACE];
    public name = CardName.SATELLITES;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 1 + player.getTagCount(Tags.SPACE));
      return undefined;
    }
}
