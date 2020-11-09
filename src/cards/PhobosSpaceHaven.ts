
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SpaceName} from '../SpaceName';
import {SpaceType} from '../SpaceType';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class PhobosSpaceHaven implements IProjectCard {
    public cost = 25;
    public tags = [Tags.SPACE, Tags.CITY];
    public name = CardName.PHOBOS_SPACE_HAVEN;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.addCityTile(player, SpaceName.PHOBOS_SPACE_HAVEN, SpaceType.COLONY);
      player.addProduction(Resources.TITANIUM);
      return undefined;
    }
    public getVictoryPoints() {
      return 3;
    }
}
