
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class Soletta implements IProjectCard {
    public cost = 35;
    public tags = [Tags.SPACE];
    public cardType = CardType.AUTOMATED;
    public name = CardName.SOLETTA;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.HEAT, 7);
      return undefined;
    }
}
