
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class ImportedGHG implements IProjectCard {
    public cost = 7;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.IMPORTED_GHG;
    public cardType = CardType.EVENT;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.HEAT);
      player.heat += 3;
      return undefined;
    }
}

