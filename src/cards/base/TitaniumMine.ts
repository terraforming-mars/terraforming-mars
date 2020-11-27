
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class TitaniumMine implements IProjectCard {
    public cost = 7;
    public tags = [Tags.STEEL];
    public name = CardName.TITANIUM_MINE;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.TITANIUM);
      return undefined;
    }
}
