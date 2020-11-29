
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class Mine implements IProjectCard {
    public cost = 4;
    public tags = [Tags.STEEL];
    public name = CardName.MINE;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      return undefined;
    }
}
