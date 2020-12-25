
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './CorporationCard';
import {ISpace} from '../../boards/ISpace';
import {SpaceBonus} from '../../SpaceBonus';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';


export class MiningGuild implements CorporationCard {
    public name = CardName.MINING_GUILD;
    public tags = [Tags.STEEL, Tags.STEEL];
    public startingMegaCredits: number = 30;
    public cardType = CardType.CORPORATION;

    public onTilePlaced(player: Player, space: ISpace) {
      if (
        player.isCorporation(this.name) &&
            space.player === player &&
            (space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1)) {
        player.addProduction(Resources.STEEL);
      }
    }
    public play(player: Player) {
      player.steel = 5;
      player.addProduction(Resources.STEEL);
      return undefined;
    }
}
