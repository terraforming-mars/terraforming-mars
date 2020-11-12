import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class DawnCity implements IProjectCard {
    public cost = 15;
    public tags = [Tags.CITY, Tags.SPACE];
    public name = CardName.DAWN_CITY;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 4 && player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.TITANIUM);
      game.addCityTile(player, SpaceName.DAWN_CITY, SpaceType.COLONY);
      return undefined;
    }
    public getVictoryPoints() {
      return 3;
    }
}
