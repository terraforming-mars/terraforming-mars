import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {ISpace} from '../../ISpace';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class LakefrontResorts implements CorporationCard {
    public name = CardName.LAKEFRONT_RESORTS;
    public tags = [Tags.STEEL];
    public startingMegaCredits: number = 54;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.oceanBonus = 3;
      return undefined;
    }
    public onTilePlaced(player: Player, space: ISpace) {
      if (space.tile !== undefined && space.tile.tileType === TileType.OCEAN) {
        player.addProduction(Resources.MEGACREDITS);
      }
    }
}
